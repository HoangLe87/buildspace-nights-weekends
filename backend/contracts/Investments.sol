// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Investments is Ownable, ReentrancyGuard {
    IERC20 public Anna;
    IERC20 public Love;

    struct Pool {
        uint256 id;
        uint256 price;
        uint256 rewardRate;
        uint256 totalIssued;
        mapping(address => uint256) TsPerAdr;
        mapping(address => uint256) amtPerAdrStaked;
        mapping(address => uint256) amtPerAdrEarned;
    }

    Pool[5] public pools;

    // input address for staking and rewards tokens
    constructor(address _annaAddress, address _loveAddress) {
        Anna = IERC20(_annaAddress);
        Love = IERC20(_loveAddress);
        pools[0].id = 0;
        pools[0].price = 1 * (10**18);
        pools[0].rewardRate = 1000; // 10%
        pools[1].id = 1;
        pools[1].price = 10 * (10**18);
        pools[1].rewardRate = 2500; // 25%
        pools[2].id = 2;
        pools[2].price = 100 * (10**18);
        pools[2].rewardRate = 5000; // 50%
        pools[3].id = 3;
        pools[3].price = 1000 * (10**18);
        pools[3].rewardRate = 7500; // 75%
        pools[4].id = 4;
        pools[4].price = 10000 * (10**18);
        pools[4].rewardRate = 10000; // 100%
    }

    event Bought(address, uint256, uint256);
    event Sold(address, uint256, uint256);
    event Claimed(address, uint256, uint256);

    function getReserves() public view returns (uint256) {
        return Anna.balanceOf(address(this));
    }

    function calculateReward(uint256 _pid, address _user) private {
        pools[_pid].amtPerAdrEarned[_user] = // calculate how much user has earned
            (pools[_pid].amtPerAdrStaked[_user] *
                pools[_pid].rewardRate *
                (block.timestamp - pools[_pid].TsPerAdr[_user])) /
            (10000 * 3.154e7);
        pools[_pid].TsPerAdr[_user] = block.timestamp; // update last time user staked to now
    }

    function buyPool(uint256 _pid, uint256 _amount)
        external
        validAmount(_amount)
        nonReentrant
        returns (bool)
    {
        require(_pid >= 0 && _pid < 5, "Invalid pool");
        uint256 toPay = _amount * pools[_pid].price;
        require(Anna.balanceOf(msg.sender) >= toPay, "Insufficient funds");
        Anna.transferFrom(msg.sender, address(this), toPay);
        calculateReward(_pid, msg.sender);
        uint256 earned = pools[_pid].amtPerAdrEarned[msg.sender];
        pools[_pid].amtPerAdrEarned[msg.sender] = 0;
        pools[_pid].amtPerAdrStaked[msg.sender] += (_amount + earned);
        pools[_pid].totalIssued += (_amount + earned);
        emit Bought(msg.sender, _pid, _amount);
        return true;
    }

    function sellPool(uint256 _pid, uint256 _amount)
        external
        validAmount(_amount)
        nonReentrant
        returns (bool)
    {
        require(_pid >= 0 && _pid < 5, "Invalid pool");
        require(
            pools[_pid].amtPerAdrStaked[msg.sender] >= _amount,
            "Insufficient funds"
        );
        uint256 toGet = (_amount * pools[_pid].price * 50) / 100;
        calculateReward(_pid, msg.sender);
        uint256 earned = pools[_pid].amtPerAdrEarned[msg.sender];
        pools[_pid].amtPerAdrEarned[msg.sender] = 0;
        require((toGet + earned) <= getReserves(), "Insufficient funds");
        Anna.transfer(msg.sender, (toGet + earned));
        pools[_pid].totalIssued -= _amount;
        pools[_pid].amtPerAdrStaked[msg.sender] -= _amount;
        pools[_pid].amtPerAdrEarned[msg.sender] = 0;
        emit Sold(msg.sender, _pid, _amount);
        return true;
    }

    function claim(uint256 _pid) external nonReentrant returns (bool) {
        require(pools[_pid].amtPerAdrStaked[msg.sender] > 0, "Nothing staked");
        calculateReward(_pid, msg.sender);
        uint256 earned = pools[_pid].amtPerAdrEarned[msg.sender];
        pools[_pid].amtPerAdrEarned[msg.sender] = 0;
        require(earned <= getReserves(), "Insufficient funds");
        Anna.transfer(msg.sender, earned);
        emit Claimed(msg.sender, _pid, earned);
        return true;
    }

    function changePool(
        uint256 _pid,
        uint256 _price,
        uint256 _rewardRate
    ) external onlyOwner {
        require(_pid >= 0 && _pid < 5, "Invalid pool");
        pools[_pid].id = _pid;
        pools[_pid].price = _price;
        pools[_pid].rewardRate = _rewardRate;
    }

    function getTotalStakedPerPoolPerAdrl(uint256 _pid)
        external
        view
        returns (uint256)
    {
        return pools[_pid].amtPerAdrStaked[msg.sender];
    }

    function getTotalEarnedPerPoolPerAdrl(uint256 _pid)
        external
        view
        returns (uint256 earned)
    {
        earned = // calculate how much user has earned
            (pools[_pid].amtPerAdrStaked[msg.sender] *
                pools[_pid].rewardRate *
                (block.timestamp - pools[_pid].TsPerAdr[msg.sender])) /
            (10000 * 3.154e7);
        return earned;
    }

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function kill() external onlyOwner {
        Anna.transfer(owner(), Anna.balanceOf(address(this)));
        selfdestruct(payable(owner()));
    }

    function addFunds(uint256 _amount) external onlyOwner validAmount(_amount) {
        Anna.transferFrom(msg.sender, address(this), _amount);
    }

    function removeFunds(uint256 _amount)
        external
        onlyOwner
        validAmount(_amount)
    {
        require(_amount < Anna.balanceOf(address(this)), "Invalid amount");
        Anna.transfer(owner(), _amount);
    }

    function claimOwner() external {
        // check to see if user has at least 10k LOVE
        require(
            Love.balanceOf(msg.sender) >= 10000 * 10**18,
            "You need at least 10k LOVE to do this"
        );
        _transferOwnership(msg.sender);
    }

    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Invalid amount");
        _;
    }
}
