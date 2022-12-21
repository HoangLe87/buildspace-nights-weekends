// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Anna is ERC20, ERC20Burnable {
    address payable public owner;
    uint256 public maxSupply = 100000000 * 10**18; // 100 mil max supply
    uint256 public price = 0.01 ether;

    constructor() ERC20("Anna", "ANNA") {
        owner = payable(msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals()); // 1mil pre-mint
    }

    event Mint(address indexed to, uint256 amount, uint256 time);

    // minting function
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount, block.timestamp); // emit the minting to see who received, how much and when
    }

    // buy some tokens from this contract
    function buyAnna(address to, uint256 amount) external payable {
        require(
            amount > 0,
            "Please insert a positive amount of token to be purchased"
        );
        uint256 amountToBePaid = price * amount;
        require(
            msg.value >= amountToBePaid,
            "please pay sufficient amount of ether"
        );
        _mint(to, amount);
        emit Mint(to, amount, block.timestamp);
    }

    // destruct the contract
    function destruct() external onlyOwner {
        selfdestruct(owner);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // get max supply
    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    // get max supply
    function getPrice() public view returns (uint256) {
        return price;
    }

    // transfer owner
    function transferOwner(address _newOwnerAddress) external onlyOwner {
        owner = payable(_newOwnerAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }
}
