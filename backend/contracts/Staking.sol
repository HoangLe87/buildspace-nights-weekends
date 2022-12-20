// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error TransferFailed();
error NeedsMoreThanZero();

contract Staking is ReentrancyGuard {
    address payable public owner;
    // token to be rewarded - ANNA
    IERC20 public rewardsToken;
    // token to be staked - ANNA
    IERC20 public stakingToken;

    // 1% reward
    uint256 public constant REWARD_RATE = 100;
    // most current time i.e block
    uint256 public lastUpdateTime;
    // reward per token staked for all users
    uint256 public rewardPerTokenStaked;
    // total supply of stakingToken that are currently staked
    uint256 private totalSupply;
    // mapping of individual rewardPerTokenStaked per address
    mapping(address => uint256) public userRewardPerTokenStaked;
    // mapping of rewards to be paid per address
    mapping(address => uint256) public rewards;
    // mapping of stakingToken balances that are currently staked per address
    mapping(address => uint256) public balances;

    // events
    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    // input address for staking and rewards tokens
    constructor(address _stakingTokenAddress, address _rewardsTokenAddress) {
        owner = payable(msg.sender);
        rewardsToken = IERC20(_rewardsTokenAddress);
        stakingToken = IERC20(_stakingTokenAddress);
    }

    /**
     * @dev How much reward a token gets based on how long it's been staked
     */
    function rewardPerToken() public returns (uint256) {
        if (totalSupply == 0) {
            rewardPerTokenStaked = 0; // zero as nothing is staked
            return rewardPerTokenStaked;
        } else {
            return (rewardPerTokenStaked +
                ((block.timestamp - lastUpdateTime) * REWARD_RATE * 1e18) /
                totalSupply);
        }
    }

    /**
     * @dev How much reward a user has earned
     */
    function earned(address _userAccount) public returns (uint256) {
        return
            ((balances[_userAccount] *
                (rewardPerToken() - userRewardPerTokenStaked[_userAccount])) /
                1e18) + rewards[_userAccount];
    }

    /**
     * @notice Deposit tokens into this contract
     * @param amount | How much to stake
     */
    function stake(uint256 amount)
        external
        updateReward(msg.sender)
        nonReentrant
        moreThanZero(amount)
    {
        totalSupply += amount; // increase total staked amount
        balances[msg.sender] += amount; // map total staked balance to the address
        emit Staked(msg.sender, amount); // emit staked info
        bool success = stakingToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice Withdraw tokens from this contract
     * @param amount | How much to withdraw
     */
    function withdraw(uint256 amount)
        external
        updateReward(msg.sender)
        nonReentrant
    {
        require(
            totalSupply >= amount,
            "insufficient total supply to allow withdrawal"
        );
        totalSupply -= amount; // decrease total staked amount
        require(
            balances[msg.sender] >= amount,
            "You are withdrawing more than what you have"
        );
        balances[msg.sender] -= amount; // decrease amount staked from the address
        emit WithdrewStake(msg.sender, amount);
        bool success = stakingToken.transfer(msg.sender, amount);
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @notice User claims their tokens
     */
    function claimReward() external updateReward(msg.sender) nonReentrant {
        uint256 reward = rewards[msg.sender]; // user reward
        rewards[msg.sender] = 0; // set reward to zero
        emit RewardsClaimed(msg.sender, reward);
        bool success = rewardsToken.transfer(msg.sender, reward);
        if (!success) {
            revert TransferFailed();
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // destruct the contract
    function destruct() external onlyOwner {
        selfdestruct(owner);
    }

    modifier updateReward(address account) {
        rewardPerTokenStaked = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenStaked[account] = rewardPerTokenStaked;
        _;
    }

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert NeedsMoreThanZero();
        }
        _;
    }

    function getStaked(address _accountAddress) public view returns (uint256) {
        return balances[_accountAddress];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }
}
