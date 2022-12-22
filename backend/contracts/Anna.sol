// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Anna is ERC20, ERC20Burnable {
    // ---------------------- definitions ------------------ //
    address payable public owner;
    uint128 public maxSupply = 1000000000 * 10**18; // 1000 mil max supply
    uint128 public price = 0.1 ether;
    bool public isLocked = true; // additional security for claiming ownership

    // constructor
    constructor() ERC20("Anna", "ANNA") {
        owner = payable(msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals()); // 1mil pre-mint
    }

    // events
    event Minted(address indexed to, uint256 amount, uint256 time);
    event OwnerChanged(address indexed to, uint256 time);
    event WithdrawalDone(address indexed to, uint256 amount, uint256 time);

    // ---------------------- functions ------------------ //

    /**
     * @dev mint ANNA
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Minted(to, amount, block.timestamp); // emit the minting to see who received, how much and when
    }

    /**
     * @dev buy ANNA
     * check for position purchase amount
     * check for sufficient ETH amount to make purchase
     */
    function buyAnna(address to, uint256 amount) external payable {
        // check that purchase amount is bigger than zero
        require(
            amount > 0,
            "Please insert a positive amount of token to be purchased"
        );
        uint256 amountToBePaid = price * amount;
        // check that the payment sent is enough for the purchase
        require(
            msg.value >= amountToBePaid,
            "Please make a sufficient payment"
        );
        // check that the contract actually recived the payment
        require(address(this).balance >= msg.value, "Money not yet recieved");
        _mint(to, amount);
        emit Minted(to, amount, block.timestamp);
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
        require(amount > 0, "Nothing to withdraw: the contract balance empty");
        (bool sucess, ) = owner.call{value: amount}("");
        require(sucess, "Failed to withdraw funds");
        emit WithdrawalDone(msg.sender, amount, block.timestamp);
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
    }

    // let user claim ownership if the user's balance is 10k gAnna or more
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
        require(isLocked==false, "The contract is locked, please unlock")
        owner = payable(msg.sender);
        emit OwnerChanged(msg.sender, block.timestamp);
        isLocked=true;
    } 
    */

    // ---------------------- utilities ------------------ //
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
