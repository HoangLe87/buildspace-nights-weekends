// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error TransferFailed();

contract Exchange is ERC20, ReentrancyGuard {
    // update with ANNA's token address at deployment with constructor
    address public annaAddress;
    address payable public owner;

    // events
    event AddedLiquidity(
        address indexed user,
        uint256 ethAmount,
        uint256 annaAmount,
        uint256 time
    );
    event RemovedLiquidity(
        address indexed user,
        uint256 ethAmount,
        uint256 annaAmount,
        uint256 time
    );
    event BougthAnnaForEth(
        address indexed user,
        uint256 ethAmount,
        uint256 annaAmount,
        uint256 time
    );
    event SoldAnnaForEth(
        address indexed user,
        uint256 ethAmount,
        uint256 annaAmount,
        uint256 time
    );

    // Exchange LP token is ERC20 token
    constructor(address _annaAddress) ERC20("ANNA LP Token", "xANNA") {
        require(
            _annaAddress != address(0),
            "ANNA token address passed must be valid"
        );
        annaAddress = _annaAddress;
        owner = payable(msg.sender);
    }

    /**
     * @dev Returns the amount of ANNA ERC20 token and eth native amount held by this contract
     */
    function getReserves()
        public
        view
        returns (uint256 annaReserve, uint256 ethBalance)
    {
        // Retrieve reserves
        annaReserve = IERC20(annaAddress).balanceOf(address(this));
        ethBalance = address(this).balance;
    }

    /**
     * @dev Adds liquidity
     * amount of ANNA and Eth to be added
     * to add liquidity call addLiquidity function with below params:
     * _annaAmount of ANNA tokens and msg.value is the amount of Eth
     */
    function addLiquidity(uint256 _annaAmount)
        public
        payable
        nonReentrant
        returns (uint256 liquidity)
    {
        require(
            _annaAmount > 0,
            "Please send ANNA token amount larger than zero"
        );
        // Retrieve reserves
        (uint256 annaReserve, uint256 ethBalance) = getReserves();
        // If the reserve is empty, intake any user supplied value as the initial ratio
        // of ANNA token sent and msg.value of Eth
        IERC20 anna = IERC20(annaAddress);
        if (annaReserve == 0) {
            // Transfer the `ANNA` from the user's account to the contract
            bool success = anna.transferFrom(
                msg.sender,
                address(this),
                _annaAmount
            );
            // if transfer is not successful revert with error
            if (!success) {
                revert TransferFailed();
            }
            // Take the current ethBalance and mint ethBalance amount of LP tokens to the user.
            liquidity = ethBalance;
            uint256 annaToBeAdded = _annaAmount;
            emit AddedLiquidity(
                msg.sender,
                msg.value,
                annaToBeAdded,
                block.timestamp
            );
        } else {
            // If the reserve is not empty, iration must be calculated
            require(
                ethBalance > msg.value,
                "Current contract ETH balance is too low"
            );
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
}
