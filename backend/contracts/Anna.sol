// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Anna is ERC20, ERC20Burnable {
    address payable public owner;

    constructor() ERC20("Anna", "ANNA") {
        owner = payable(msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals()); // 1mil pre-mint
    }

    event Mint(address indexed to, uint256 amount, uint256 time);

    // minting function
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount, block.timestamp); // emit the minting to see who recived, how much and when
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
