// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error TransferFailed();

contract Exchange is ERC20 {
    // The IERC20 interface allows us to access the token contracts
    IERC20 private immutable token1;
    IERC20 private immutable token2;
    address payable public owner;
    uint256 totalLpSharesIssued; // Stores the total amount of share issued for the LP pool
    uint256 K; // Algorithmic constant used to determine price
    mapping(address => uint256) lpSharesPerAddress; // Stores the LP share holding of each user

    // events
    event AddedLiquidity(
        address indexed user,
        uint256 token1Total,
        uint256 token2Total,
        uint256 time
    );
    event RemovedLiquidity(
        address indexed user,
        uint256 token1Total,
        uint256 token2Total,
        uint256 time
    );
    event BoughtToken1(
        address indexed user,
        uint256 token1Total,
        uint256 token2Total,
        uint256 time
    );
    event BoughtToken2(
        address indexed user,
        uint256 token1Total,
        uint256 token2Total,
        uint256 time
    );

    // Pass the token addresses to the constructor
    constructor(IERC20 _token1, IERC20 _token2) ERC20("LP ANNA", "xANNA") {
        require(
            token1 != address(0) && token2 != address(0),
            "Invalid token addresses"
        );
        token1 = _token1;
        token2 = _token2;
        owner = payable(msg.sender);
    }

    /**
     * @dev Returns the amount of tokens held by this contract
     */
    function getReserves()
        public
        view
        returns (uint256 token1Reserves, uint256 token2Reserves)
    {
        // Retrieve reserves
        token1Reserves = token1.balanceOf(address(this));
        token2Reserves = token2.balanceOf(address(this));
    }

    /**
     * @dev Adds liquidity
     * amount of ANNA and Eth to be added
     * to add liquidity call addLiquidity function with below params:
     * _annaAmount of ANNA tokens and msg.value is the amount of Eth
     */
    function addLiquidity(uint256 _token1Amount)
        public
        validAmountCheck(token1, _token1Amount)
        returns (uint256 lpShares)
    {
        (uint256 annaReserve, uint256 ethBalance) = getReserves();
        if (totalLpShares == 0) {
            bool success = anna.transferFrom(
                msg.sender,
                address(this),
                _annaAmount
            );
            lpShares = 100 * 10**18; // Initial liquidity provider is issued with 100 tokens
        } else {
            // If the reserve is not empty, ratio must be calculated
            require(token1Total > 0, "Insufficient reserves");
            require(token2Total > 0, "Insufficient reserves");
            uint256 share1 = totalLpShares * (_token1Amount / token1Total);
            uint256 share2 = totalLpShares * (_token2Amount / token2Total);

            uint256 ethReserve = ethBalance - msg.value;
            require(ethReserve > 0, "Eth reserve is negative or zero");
            // annaToBeAdded/ annaReserve in the contract) = (Eth Sent by the user/ ethReserve in the contract);
            // annaToBeAdded = Eth Sent by the user * annaReserve / ethReserve);
            uint256 annaToBeAdded = (msg.value * annaReserve) / (ethReserve);
            require(
                _annaAmount >= annaToBeAdded,
                "Amount of tokens sent is less than the minimum ANNA tokens required to meet the LP ratio"
            );
            bool sucess = anna.transferFrom(
                msg.sender,
                address(this),
                annaToBeAdded
            );
            require(sucess, "deposit of ANNA tokens failed");
            // LP tokens to be sent to the user (liquidity)/ totalSupply of LP tokens in contract) = (Eth sent by the user)/ethReserve
            // -> liquidity =  totalSupply of LP tokens in contract * (Eth sent by the user))/ethReserve
            liquidity = (totalSupply() * msg.value) / ethReserve;
            emit AddedLiquidity(
                msg.sender,
                msg.value,
                annaToBeAdded,
                block.timestamp
            );
        }
        // send the user the LP tokens
        _mint(msg.sender, liquidity);
    }

    /**
     * @dev Remove liquidity and burn LP tokens
     * amount of Eth and ANNA to be withdrawn
     */
    function removeLiquidity(uint256 _lpAmount)
        public
        payable
        nonReentrant
        returns (uint256 ethWithdrawAmount, uint256 annaWithdrawAmount)
    {
        require(_lpAmount > 0, "_amount should be greater than zero");
        // check to see if user has the lp tokens
        uint256 lpAmountHeldByUser = balanceOf(msg.sender);
        require(
            _lpAmount <= lpAmountHeldByUser,
            "cannot withdraw more lp token than what you own"
        );
        //get reserves of this contract
        (uint256 annaReserve, uint256 ethBalance) = getReserves();
        uint256 _totalSupply = totalSupply();
        require(_totalSupply > 0, "total supplly of LP tokens is zero");
        // calc withdrawal amounts based on existing ratios
        ethWithdrawAmount = (ethBalance * _lpAmount) / _totalSupply;
        annaWithdrawAmount = (annaReserve * _lpAmount) / _totalSupply;
        // Burn the LP tokens from the user's wallet
        _burn(msg.sender, _lpAmount);
        // Transfer ethWithdrawAmount of Eth from the contract to the user
        (bool success, ) = (msg.sender).call{value: ethWithdrawAmount}("");
        require(success, "Eth withdrawal failed");
        // Transfer AnnaWithdrawAmount of ANNA from the contract to the user
        bool sent = IERC20(annaAddress).transfer(
            msg.sender,
            annaWithdrawAmount
        );
        if (!sent) {
            revert TransferFailed();
        }
        emit RemovedLiquidity(
            msg.sender,
            ethWithdrawAmount,
            annaWithdrawAmount,
            block.timestamp
        );
    }

    /**
     * @dev Pricing function of token2 if we provide tokenInAmount of token1 in
     * @notice fees taken intout account. 1 % fees removed from tokenInAmount
     */
    function getAmountOfTokens(
        uint256 tokenInAmount,
        uint256 tokenInReserve,
        uint256 tokenOutReserve
    ) public pure returns (uint256 tokenOutAmount) {
        require(
            tokenInReserve > 0 && tokenOutReserve > 0,
            "insuffient reserves"
        );
        require(tokenInAmount > 0, "tokenInAMount mut be larger than zero");
        uint256 tokenInAmounWithFee = tokenInAmount * 99;
        // `XY = K` curve -> (x + Δx) * (y - Δy) = x * y
        // So the final formula is Δy = (y * Δx) / (x + Δx)
        // Δy is `tokens to be received`
        uint256 numerator = tokenInAmounWithFee * tokenOutReserve;
        uint256 denominator = (tokenInReserve * 100) + tokenInAmounWithFee;
        return numerator / denominator; // tokenOutAmount amount
    }

    /**
     * @dev Swaps Eth for ANNA
     * need to have msg.value and enter the min amount of ANNA tokens user wishes to buy
     */
    function ethToAnna(uint256 _minAnnaAmount) public payable nonReentrant {
        (uint256 annaReserve, uint256 ethBalance) = getReserves();
        // call the getAmountOfTokens to get the amount of ANNA tokens
        // that would be returned to the user after the swap
        uint256 annaBought = getAmountOfTokens(
            msg.value,
            ethBalance - msg.value,
            annaReserve
        );

        require(
            annaBought >= _minAnnaAmount,
            "Please increase eth or lower the purchase amount"
        );
        // Transfer the ANNA tokens to the user
        bool success = IERC20(annaAddress).transfer(msg.sender, annaBought);
        if (!success) {
            revert TransferFailed();
        }
        emit BougthAnnaForEth(
            msg.sender,
            msg.value,
            annaBought,
            block.timestamp
        );
    }

    /**
     * @dev Swaps ANNA Tokens for Eth
     * user enters min eth that he wants back and how many tokens he wishes to sell
     */
    function annaToEth(uint256 _annaSold, uint256 _minEth)
        public
        payable
        nonReentrant
    {
        (uint256 annaReserve, uint256 ethBalance) = getReserves();
        // call the getAmountOfTokens to get the amount of Eth
        // that would be returned to the user after the swap
        uint256 ethToBeRecieved = getAmountOfTokens(
            _annaSold,
            annaReserve,
            ethBalance
        );
        require(ethToBeRecieved >= _minEth, "Eth Amount low");
        // Transfer ANNA tokens from the user's address to the contract
        bool success = IERC20(annaAddress).transferFrom(
            msg.sender,
            address(this),
            _annaSold
        );
        if (!success) {
            revert TransferFailed();
        }
        // send the `ethBought` to the user from the contract
        (bool sent, ) = (msg.sender).call{value: ethToBeRecieved}("");
        require(sent, "Withdrawal of Eth failed");
        emit SoldAnnaForEth(
            msg.sender,
            ethToBeRecieved,
            _annaSold,
            block.timestamp
        );
    }

    // destruct the contract
    function destruct() external onlyOwner {
        selfdestruct(owner);
    }

    // transfer owner
    function transferOwner(address _newOwnerAddress) external onlyOwner {
        owner = payable(_newOwnerAddress);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    // Liquidity must be provided before we can make swaps from the pool
    modifier activePool() {
        require(totalLpShares > 0, "The pool has zero Liquidity");
        _;
    }

    // check that transaction amount > 0 and that the user has enough tokens
    modifier validAmountCheck(IERC20 _token, uint256 _amount) {
        require(_amount > 0, "Amount cannot be zero!");
        require(_amount <= _token.balanceOf(msg.sender), "Insufficient amount");
        _;
    }

    // check thay transaction amount is > 0  and that user has enough LP tokens
    modifier validLpSharesCheck(uint256 _amount) {
        require(_amount > 0, "Share amount cannot be zero!");
        require(_amount <= shares[msg.sender], "Insufficient share amount");
        _;
    }
}
