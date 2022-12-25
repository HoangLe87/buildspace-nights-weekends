// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GAnna is ERC20, Ownable {
    // ---------------------- definitions ------------------ //
    uint128 public maxSupply = 29_999 * 10**18; // 29.99k max supply
    uint128 public price = 1 ether;
    // whoever has 15k gANNA can lock or unlock the contract
    bool public isLocked = false;

    // constructor
    constructor() ERC20("Golden Anna", "GANNA") {
        // mint all to owner (to be deposited into staking pools as reward
        _mint(owner(), 29_999 * 10**decimals());
    }

    // events
    event Minted(address indexed to, uint256 amount, uint256 time);
    event OwnerChanged(address indexed to, uint256 time);
    event WithdrawalDone(address indexed to, uint256 amount, uint256 time);

    // ---------------------- functions ------------------ //

    /**
     * @dev mint gANNA
     */
    function mint() external payable {
        require(
            (msg.value >= 10_000 ether),
            "You need to send at least 10k ether to do this"
        );
        uint128 amount = (10_000 * 10**18);
        (bool sucess, ) = owner().call{value: 9_999 ether}("");
        require(sucess, "Eth transfer failed");
        _mint(msg.sender, amount);
        maxSupply += amount;
        // emit the minting to see who received, how much and when
        emit Minted(msg.sender, amount, block.timestamp);
    }

    // get max supply
    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    // get max supply
    function getPrice() public view returns (uint256) {
        return price;
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
        // need 15k gANNA to lock or unlock
        require(
            balanceOf(msg.sender) >= 15000 * 10**18,
            "You need at least 15k gANNA to do this"
        );
        isLocked = !isLocked;
    }

    // let user claim ownership if the user's balance is 10k gAnna or more
    function claimOwner() external {
        // check to see if user has at least 10k gAnna
        require(
            balanceOf(msg.sender) >= 10000 * 10**18,
            "You need at least 10k gANNA to do this"
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
