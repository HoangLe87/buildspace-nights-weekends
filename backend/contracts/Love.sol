// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Love is ERC20, Ownable {
    // ---------------------- definitions ------------------ //
    uint256 public maxSupply = 29_999 * 10**18; // 29.99k max supply
    uint256 public price = 100;
    // whoever has 15k LOVE can lock or unlock the contract
    bool public isLocked = false;

    // constructor
    constructor() ERC20("Love", "LOVE") {
        // mint all to owner (to be deposited into staking pools as reward
        _mint(owner(), 29_999 * 10**decimals());
    }

    // events
    event BuyOut(address indexed to, uint256 amount, uint256 time);
    event OwnerChanged(address indexed to, uint256 time);
    event WithdrawalDone(address indexed to, uint256 amount, uint256 time);

    // ---------------------- functions ------------------ //

    /**
     * buy out for fixed price
     */
    function buyOut() external payable {
        uint256 buyOutPrice = (10_000 * price * 10**18) / 100;
        require(
            (msg.value >= buyOutPrice),
            "You need to send at least 10k ether to do this"
        );
        uint128 amount = (10_000 * 10**18);
        (bool sucess, ) = owner().call{value: (buyOutPrice - (0.1 * 10**18))}(
            ""
        );
        require(sucess, "Eth transfer failed");
        _mint(msg.sender, amount);
        maxSupply += amount;
        // emit the BuyOut to see who received, how much and when
        emit BuyOut(msg.sender, amount, block.timestamp);
    }

    // get max supply
    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    // set the buyout price
    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    // withdrawal
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(
            amount > 0,
            "Nothing to withdraw: the contract balance is empty"
        );
        (bool sucess, ) = (msg.sender).call{value: amount}("");
        require(sucess, "Failed to withdraw funds");
        emit WithdrawalDone(msg.sender, amount, block.timestamp);
    }

    // unlock the contract
    function unlock() external {
        // need 15k LOVE to lock or unlock
        require(
            balanceOf(msg.sender) >= 15000 * 10**18,
            "You need at least 15k LOVE to do this"
        );
        isLocked = !isLocked;
    }

    // let user claim ownership if the user's balance is 10k LOVE or more
    function claimOwner() external {
        // check to see if user has at least 10k LOVE
        require(
            balanceOf(msg.sender) >= 10000 * 10**18,
            "You need at least 10k LOVE to do this"
        );
        require(isLocked == false, "The contract is locked, please unlock");
        _transferOwnership(msg.sender);
        isLocked = true;
        emit OwnerChanged(msg.sender, block.timestamp);
    }

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function destruct() external onlyOwner {
        selfdestruct(payable(owner()));
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
