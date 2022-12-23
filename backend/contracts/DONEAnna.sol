// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Anna is ERC20 {
    // ---------------------- definitions ------------------ //
    address payable public owner;
    uint128 public price = 0.1 ether;
    // additional security for claiming ownership
    bool public isLocked = false;

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
    function buyAnna(uint256 _amount) external payable {
        // check that purchase amount is bigger than zero
        require(
            _amount > 0,
            "Please insert a positive amount of token to be purchased"
        );
        uint256 amountToBePaid = price * _amount;
        // check that the payment sent is enough for the purchase
        require(
            msg.value >= amountToBePaid,
            "Please make a sufficient payment"
        );
        // check that the contract actually recived the payment
        require(address(this).balance >= msg.value, "Money not yet recieved");
        _mint(msg.sender, _amount);
        emit Minted(msg.sender, _amount, block.timestamp);
    }

    // get price
    function getPrice() external view returns (uint256) {
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

        owner = payable(msg.sender);
        isLocked = true;
        emit OwnerChanged(msg.sender, block.timestamp);
    }

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
        _;
    }
}
