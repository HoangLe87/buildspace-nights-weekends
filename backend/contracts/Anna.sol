// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Anna is ERC20, Ownable {
    // ---------------------- definitions ------------------ //
    uint256 public price = 100;
    // additional security for claiming ownership
    bool public isLocked = false;
    ERC20 public LOVE;

    // constructor
    constructor(address _LOVE) ERC20("Anna", "ANNA") {
        _mint(owner(), 1000000 * 10**decimals()); // 1mil pre-mint
        LOVE = ERC20(_LOVE);
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

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    /**
     * @dev buy ANNA
     * check for position purchase amount
     * check for sufficient ETH amount to make purchase
     */
    function buyAnna(uint256 _amount) external payable {
        // check that purchase amount is bigger than zero
        require(
            _amount > 0,
            "Please insert a positive amount of token to be purchased"
        );
        uint256 amountToBePaid = (price * _amount) / 1000;
        // check that the payment sent is enough for the purchase
        require(
            msg.value >= amountToBePaid,
            "Please make a sufficient payment"
        );
        // check that the contract actually recived the payment
        require(address(this).balance >= msg.value, "Money not yet recieved");
        _mint(msg.sender, _amount * (10**18));
        emit Minted(msg.sender, _amount, block.timestamp);
    }

    // withdrawal
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw: the contract balance empty");
        (bool sucess, ) = (msg.sender).call{value: amount}("");
        require(sucess, "Failed to withdraw funds");
        emit WithdrawalDone(msg.sender, amount, block.timestamp);
    }

    // unlock the contract
    function unlock() external {
        // need 15k LOVE to lock or unlock
        require(
            LOVE.balanceOf(msg.sender) >= 15000 * 10**18,
            "You need at least 15k LOVE to do this"
        );
        isLocked = !isLocked;
    }

    // let user claim ownership if the user's balance is 10k LOVE or more
    function claimOwner() external {
        // check to see if user has at least 10k LOVE
        require(
            LOVE.balanceOf(msg.sender) >= 10000 * 10**18,
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
