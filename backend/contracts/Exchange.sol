// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev DEX logic to exchange ERC20 tokens
 */

contract Exchange is ERC20 {
    // ---------------------- definitions ------------------ //
    ERC20 private immutable token1;
    ERC20 private immutable token2;
    address public factoryAddress;
    address public owner;
    // 1% trading and withdrawal fee
    uint256 fee = 990;

    // events
    event FeeChanged(address indexed to, uint256 fee, uint256 time);
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
        address _owner,
        address _factoryAddress
    ) ERC20("LP ANNA", "lpANNA") {
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "Invalid addresses"
        );
        token1 = ERC20(_token1Address);
        token2 = ERC20(_token2Address);
        owner = _owner;
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
    function addLiquidity(uint256 _token1Amount) external returns (uint256) {
        (uint256 _token2Amount, uint256 lpTokensIssued) = getEstimateOfToken2(
            _token1Amount
        );
        // get the tokens from the user
        // the frontend must call the token contract's approve function first
        require(
            _token1Amount > 0 && _token2Amount > 0,
            "Must be positive amount"
        );
        require(
            (ERC20(token2).balanceOf(msg.sender) >= _token2Amount) &&
                (ERC20(token1).balanceOf(msg.sender) >= _token1Amount),
            "Insufficient tokens"
        );
        token1.transferFrom(msg.sender, address(this), _token1Amount);
        token2.transferFrom(msg.sender, address(this), _token2Amount);
        require(lpTokensIssued > 0, "Must be positive amount");
        _mint(msg.sender, lpTokensIssued);
        emit AddedLiquidity(
            msg.sender,
            _token1Amount,
            _token2Amount,
            lpTokensIssued,
            block.timestamp
        );
        return lpTokensIssued;
    }

    function getEstimateOfToken2(uint256 _token1Amount)
        public
        view
        returns (uint256 _token2Amount, uint256 lpTokensIssued)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        if (totalLpTokensIssued == 0) {
            lpTokensIssued = _token1Amount;
            _token2Amount = _token1Amount;
        } else {
            require(
                token1Reserves > 0 && token2Reserves > 0,
                "Insufficient reserves"
            );
            // calculate ratio
            _token2Amount = (_token1Amount * token2Reserves) / token1Reserves;
            // reward the liquidity provider with the lp token
            lpTokensIssued = ((totalLpTokensIssued * _token1Amount) /
                token1Reserves);
        }
        return (_token2Amount, lpTokensIssued);
    }

    /**
     * @dev remove liquidity from the pool
     */
    function removeLiquidity(uint256 _lpTokens)
        external
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
        returns (uint256, uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        require(
            _lpTokens <= balanceOf(msg.sender) &&
                _lpTokens > 0 &&
                _lpTokens <= totalLpTokensIssued,
            "Invalid amount"
        );
        // calculation amounts to be withdrawn with tax applied
        uint256 token1Amount = ((_lpTokens * fee * token1Reserves) /
            (1000 * totalLpTokensIssued));
        uint256 token2Amount = ((_lpTokens * fee * token2Reserves) /
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
    ) private view returns (uint256) {
        require(_inputAmount > 0, "Not positive amount");
        uint256 numerator = _inputAmount * fee * _outputReserves;
        uint256 denominator = (1000 * _inputReserves + (_inputAmount * fee));
        return numerator / denominator;
    }

    //get estimated token2Amount for _token1Amount sold
    function sellToken1EstimateAmount(uint256 _token1Amount)
        public
        view
        returns (uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        require(totalLpTokensIssued > 0, "Inactive pool");
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
        returns (uint256)
    {
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        require(totalLpTokensIssued > 0, "Inactive pool");
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

    // change fee
    function setFee(uint256 _fee) public {
        require(
            _fee >= 900 && _fee <= 1000,
            "Only between 900 (10% fee) and 1000 (0% fee)"
        );
        require(msg.sender == factoryAddress, "Not factory");
        fee = _fee;
        emit FeeChanged(msg.sender, _fee, block.timestamp);
    }

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function destruct() public {
        require(msg.sender == factoryAddress, "Not factory");
        token1.transfer(owner, token1.balanceOf(address(this)));
        token2.transfer(owner, token2.balanceOf(address(this)));
        selfdestruct(payable(owner));
    }
}
