// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error TransferFailed();

interface IFactory {
    function removeExchange(address _token1Address, address _token2Address)
        external;
}

/**
 * @dev DEX logic to exchange ERC20 tokens
 * issue lp tokens to liquidity providers to distribute revenue
 */

contract Exchange is ERC20 {
    // ---------------------- definitions ------------------ //
    IERC20 private immutable token1;
    IERC20 private immutable token2;
    address payable public owner;
    // algorithmic constant used to determine price
    uint256 K;
    // 5% sales tax only applies when selling ANNA tokens
    uint256 salesTax = 95;
    // 0.5% trading fee
    uint256 tradingFee = 995;
    bool public isLocked = true; // additional security for claiming ownership

    // events
    event OwnerChanged(address indexed to, uint256 time);
    event Unlocked(address indexed to, bool isLocked, uint256 time);
    event TradingFeeChanged(address indexed to, uint256 fee, uint256 time);
    event SelesTaxChanged(address indexed to, uint256 tax, uint256 time);
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
    event BoughtToken1(
        address indexed user,
        uint256 token1Removed,
        uint256 token2Added,
        uint256 time
    );
    event BoughtToken2(
        address indexed user,
        uint256 token1Added,
        uint256 token2Removed,
        uint256 time
    );

    // contructor
    constructor(address _token1Address, address _token2Address)
        ERC20("LP ANNA", "lpANNA")
    {
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "invalid token addresses"
        );
        token1 = IERC20(_token1Address);
        token2 = IERC20(_token2Address);
        owner = payable(msg.sender);
    }

    // ---------------------- functions ------------------ //

    /**
     * @dev recalculates the amount of tokens held by this contract
     */
    function getReserves()
        public
        view
        returns (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        )
    {
        // retrieve reserves
        token1Reserves = token1.balanceOf(address(this));
        token2Reserves = token2.balanceOf(address(this));
        totalLpTokensIssued = totalSupply();
    }

    /**
     * @dev add liquidity to the pool
     * check if transaction amount is bigger than zero
     * check if user has enough tokens in the wallet
     */
    function addLiquidity(uint256 _token1Amount, uint256 _token2Amount)
        external
        returns (uint256 lpTokensIssued)
    {
        // get reserves
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        // no liquidity yet
        if (totalLpTokensIssued == 0) {
            lpTokensIssued = 100 * 10**18; // init some lp tokens for the initial amount provided
        } else {
            require(
                token1Reserves > 0 && token2Reserves > 0,
                "Reserves are not sufficient"
            );
            // calculate ratio
            uint256 lpTokensIssued = totalLpTokensIssued *
                (_token1Amount / (token1Reserves));
            // check that the lp token to be issued is bigger than zero
            require(
                lpTokensIssued > 0,
                "Asset value less than threshold for contribution"
            );
            _token2Amount = ((lpTokensIssued * token2Reserves) /
                totalLpTokensIssued);
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
        // update the K
        (token1Reserves, token2Reserves, totalLpTokensIssued) = getReserves();
        K = token1Reserves * token2Reserves;
        // reward the liquidity provider with the lp token
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
        returns (uint256 token1Amount, uint256 token2Amount)
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
        // calc amounts to be withdrawn
        token1Amount = (_lpTokens * token1Reserves) / totalLpTokensIssued;
        token2Amount = (_lpTokens * token2Reserves) / totalLpTokensIssued;
        // burn lp tokens
        _burn(msg.sender, _lpTokens);
        // withdraw tokens
        token1.transfer(msg.sender, token1Amount);
        token2.transfer(msg.sender, token2Amount);
        // update the K
        (token1Reserves, token2Reserves, totalLpTokensIssued) = getReserves();
        K = token1Reserves * token2Reserves;
        // emit event
        emit RemovedLiquidity(
            msg.sender,
            token1Amount,
            token2Amount,
            _lpTokens,
            block.timestamp
        );
    }

    /**
     * @dev calculate token1 estimate for a given amount of token2
     */
    function getAmount(uint256 _token1Amount)
        private
        view
        activePool
        returns (uint256 token2Amount)
    {
        require(
            _token1Amount > 0,
            "Please choose a withdrawal amount bigger than zero"
        );
        (
            uint256 token1Reserves,
            uint256 token2Reserves,
            uint256 totalLpTokensIssued
        ) = getReserves();
        uint256 token1AmountWithFee = _token1Amount * tradingFee;
        uint256 numerator = token1AmountWithFee * token2Reserves;
        uint256 denominator = (1000 * token1Reserves + token1AmountWithFee);
        token2Amount = numerator / denominator;
    }

    function swap(uint256 _token1Amount) public view activePool {
        uint256 _token2Amount = getAmount(_token1Amount);
        token1.transferFrom(msg.sender, address(this), _token1Amount);
        token1.transferFrom(msg.sender, address(this), _token1Amount);
    }

    // change trading fee
    function setTradingFee(uint256 _tradingFee) external onlyOwner {
        require(
            _tradingFee > 900 && _tradingFee < 1000,
            "Must be between 900 (10% fee) and 1000 (0% fee)"
        );
        tradingFee = _tradingFee;
        emit TradingFeeChanged(msg.sender, _tradingFee, block.timestamp);
    }

    // change sales tax
    function setSalesTax(uint256 _salesTax) external onlyOwner {
        require(
            _salesTax > 900 && _salesTax < 1000,
            "Must be between 900 (10% tax) and 1000 (0% tax)"
        );
        salesTax = _salesTax;
        emit SelesTaxChanged(msg.sender, _salesTax, block.timestamp);
    }

    // transfer owner
    function transferOwner(address _newOwnerAddress) external onlyOwner {
        owner = payable(_newOwnerAddress);
        emit OwnerChanged(_newOwnerAddress, block.timestamp);
    }

    /*
    // unlock the contract
    function unlock() external {
        IERC20 gAnna = ERC20(gAnnaAddress);
        require(gAnna.balanceOf(msg.sender)>=10000*10**18); // need 10000 gANNA
        require(balanceOf(msg.sender)>=100*10**18); // need 100 ANNA
        isLocked = !isLocked;
        emit Unlocked(msg.sender, isLocked, block.timestamp)
    }

    //let user claim ownership if the user's balance is 10k gAnna or more
    
    function claiOwner() external {
        IERC20 gAnna = ERC20(gAnnaAddress)
        // check to see if user has at least 10k gAnna
        require(gAnna.balanceOf(msg.sender)>=10000*10**18)
        // payment of 1k gANNA to previous onwer
        bool sucess = gAnna.transferFrom(
                msg.sender,
                owner,
                1000*10**18
            );
        if (!sucess) {
            revert TransferFailed();
        }
        owner = payable(msg.sender);
        emit OwnerChanged(msg.sender, block.timestamp);
    } 
    */

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function destruct(address _token1Address, address _token2Address)
        public
        onlyOwner
    {
        //
        //IFactory(factoryAddress).removeExchange(_token1Address, _token2Address);
        selfdestruct(owner);
    }

    // function to receive Ether. msg.data must be empty
    receive() external payable {}

    // fallback function is called when msg.data is not empty
    fallback() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
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
}
