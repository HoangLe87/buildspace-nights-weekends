// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev DEX logic to exchange ERC20 tokens
 * issue lp tokens to liquidity providers to distribute revenue
 */

contract Exchange is ERC20 {
    // ---------------------- definitions ------------------ //
    IERC20 private immutable token1;
    IERC20 private immutable token2;
    address public factoryAddress;
    address public owner;
    // 0.5% trading fee
    uint256 tradingFee = 995;
    // 10% selling tax for selling ANNA tokens or withdrawing liquidity
    uint256 sellingTax = 900;

    // events
    event SellingTaxChanged(address indexed to, uint256 tax, uint256 time);
    event TradingFeeChanged(address indexed to, uint256 fee, uint256 time);
    event AddedLiquidity(
        address indexed user,
        uint256 token1Added,
        uint256 token2Added,
        uint256 lpTokenMinted,
        uint256 time
    );
    event RemovedLiquidity(
        address indexed user,
        uint256 token1Removed,
        uint256 token2Removed,
        uint256 lpTokenBurned,
        uint256 time
    );
    event Traded(
        address indexed user,
        uint256 tokenBought,
        uint256 tokenSold,
        uint256 time
    );

    // contructor
    constructor(
        address _token1Address,
        address _token2Address,
        address _annasOwner,
        address _factoryAddress
    ) ERC20("LP ANNA", "lpANNA") {
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "invalid token addresses"
        );
        token1 = IERC20(_token1Address);
        token2 = IERC20(_token2Address);
        owner = _annasOwner;
        factoryAddress = _factoryAddress;
    }

    // ---------------------- functions ------------------ //

    /**
     * @dev recalculates the amount of tokens held by this contract
     */
    function getReserves()
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        // returns token1Reserves, token2Reserves, totalLpTokensIssued
        return (
            token1.balanceOf(address(this)),
            token2.balanceOf(address(this)),
            totalSupply()
        );
    }

    /**
     * @dev add liquidity to the pool
     * check if transaction amount is bigger than zero
     * check if user has enough tokens in the wallet
     */
    function addLiquidity(uint256 _token1Amount)
        external
        returns (uint256 lpTokensIssued)
    {
        // get reserves
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        uint256 _token2Amount;
        // no liquidity yet
        if (totalLpTokensIssued == 0) {
            lpTokensIssued = _token1Amount;
            _token2Amount = _token1Amount; // init some lp tokens for the initial amount provided
        } else {
            require(
                token1Reserves > 0 && token2Reserves > 0,
                "Reserves are not sufficient"
            );
            // calculate ratio

            _token2Amount = (_token1Amount * token2Reserves) / token1Reserves;
            // reward the liquidity provider with the lp token
            lpTokensIssued = ((totalLpTokensIssued * _token1Amount) /
                token1Reserves);
        }
        // get the tokens from the user
        // the frontend must call the token contract's approve function first
        require(
            _token1Amount > 0 && _token2Amount > 0,
            "Amount cannot be zero!"
        );
        require(
            (IERC20(token2).balanceOf(msg.sender) >= _token2Amount) &&
                (IERC20(token1).balanceOf(msg.sender) >= _token1Amount),
            "User does not have sufficient amounts to add liquidity"
        );
        token1.transferFrom(msg.sender, address(this), _token1Amount);
        token2.transferFrom(msg.sender, address(this), _token2Amount);
        require(
            lpTokensIssued > 0,
            "Amount of lp tokens issues should be positive"
        );
        _mint(msg.sender, lpTokensIssued);
        emit AddedLiquidity(
            msg.sender,
            _token1Amount,
            _token2Amount,
            lpTokensIssued,
            block.timestamp
        );
    }

    /**
     * @dev remove liquidity from the pool
     * check if transaction amount is bigger than zero
     * check if the user has enough lp tokens in the wallet
     * check if the contact has enough reserves
     */
    function removeLiquidity(uint256 _lpTokens)
        external
        activePool
        validLpSharesCheck(_lpTokens)
        returns (uint256, uint256)
    {
        // calc amounts to be withdrawn
        (uint256 token1Amount, uint256 token2Amount) = getWithdrawEstimate(
            _lpTokens
        );
        // burn lp tokens
        _burn(msg.sender, _lpTokens);
        // withdraw tokens
        token1.transfer(msg.sender, token1Amount);
        token2.transfer(msg.sender, token2Amount);
        // emit event
        emit RemovedLiquidity(
            msg.sender,
            token1Amount,
            token2Amount,
            _lpTokens,
            block.timestamp
        );
        return (token1Amount, token2Amount);
    }

    // Returns the amount of tokens the user will gets back with withdrawing his lp tokens
    function getWithdrawEstimate(uint256 _lpTokens)
        public
        view
        validLpSharesCheck(_lpTokens)
        returns (uint256, uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        require(
            _lpTokens <= totalLpTokensIssued,
            "Cannot withraw more than the total supply"
        );
        // calculation amounts to be withdrawn with tax applied
        uint256 token1Amount = ((_lpTokens * sellingTax * token1Reserves) /
            (1000 * totalLpTokensIssued));
        uint256 token2Amount = ((_lpTokens * sellingTax * token2Reserves) /
            (1000 * totalLpTokensIssued));
        return (token1Amount, token2Amount);
    }

    /**
     * @dev estimation function: sell _inputAmount and user will get outputAmount
     */
    function getAmount(
        uint256 _inputAmount,
        uint256 _inputReserves,
        uint256 _outputReserves
    ) private view activePool returns (uint256) {
        require(_inputAmount > 0, "Please choose an amount bigger than zero");
        uint256 _inputAmountWithFee = _inputAmount * tradingFee;
        uint256 numerator = _inputAmountWithFee * _outputReserves;
        uint256 denominator = (1000 * _inputReserves + _inputAmountWithFee);
        uint256 outputAmount = numerator / denominator;
        return outputAmount;
    }

    //get estimated token2Amount for _token1Amount sold
    function sellToken1EstimateAmount(uint256 _token1Amount)
        public
        view
        activePool
        returns (uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        uint256 token2Amount = getAmount(
            _token1Amount,
            token1Reserves,
            token2Reserves
        );
        return token2Amount; // how much user will get for _token1Amount sold
    }

    //get estimated amount of token1 to be paid for a certain amount of token2 purchased
    function sellToken2EstimateAmount(uint256 _token2Amount)
        public
        view
        activePool
        returns (uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        uint256 token1Amount = getAmount(
            _token2Amount,
            token2Reserves,
            token1Reserves
        );
        return token1Amount; // how much user will get for _token2Amount sold
    }

    // swap function
    function sellToken1BuyToken2(uint256 _token1Amount) external {
        uint256 token2Amount = sellToken1EstimateAmount(_token1Amount);
        token1.transferFrom(msg.sender, address(this), _token1Amount);
        token2.transfer(msg.sender, token2Amount);
        emit Traded(msg.sender, token2Amount, _token1Amount, block.timestamp);
    }

    // swap function
    function sellToken2BuyToken2(uint256 _token2Amount) external {
        uint256 token1Amount = sellToken2EstimateAmount(_token2Amount);
        token2.transferFrom(msg.sender, address(this), _token2Amount);
        token1.transfer(msg.sender, token1Amount);
        emit Traded(msg.sender, token1Amount, _token2Amount, block.timestamp);
    }

    // change trading fee
    function setTradingFee(uint256 _tradingFee) public onlyViaFactory {
        require(
            _tradingFee >= 900 && _tradingFee <= 1000,
            "Must be between 900 (10% fee) and 1000 (0% fee)"
        );
        tradingFee = _tradingFee;
        emit TradingFeeChanged(msg.sender, _tradingFee, block.timestamp);
    }

    // change selling tax
    function setSellingTax(uint256 _sellingTax) public onlyViaFactory {
        require(
            _sellingTax >= 700 && _sellingTax <= 1000,
            "Must be between 700 (30% tax) and 1000 (0% tax)"
        );
        sellingTax = _sellingTax;
        emit SellingTaxChanged(msg.sender, _sellingTax, block.timestamp);
    }

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function destruct() public onlyViaFactory {
        token1.transfer(owner, token1.balanceOf(address(this)));
        token2.transfer(owner, token2.balanceOf(address(this)));
        selfdestruct(payable(owner));
    }

    // check if the pool is active i.e. any lp tokens issued yet?
    modifier activePool() {
        uint256 totalLpTokensIssued = totalSupply();
        require(totalLpTokensIssued > 0, "The pool has zero Liquidity");
        _;
    }

    // check thay transaction amount is > 0  and that user has enough LP tokens
    modifier validLpSharesCheck(uint256 _amount) {
        require(_amount > 0, "Share amount cannot be zero!");
        require(_amount <= balanceOf(msg.sender), "Insufficient share amount");
        _;
    }

    modifier onlyViaFactory() {
        require(
            msg.sender == factoryAddress,
            "This function can only be called via the Factory contract"
        );
        _;
    }
}
