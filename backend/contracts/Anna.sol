// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Anna is ERC20, ERC20Burnable, ERC20Snapshot, Ownable {
    address payable public addressANNA;
    address payable public owner;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public maxTotalSupply = 100000000e18; // 10 mil
    uint256 public tokensPerBlock = 2e18; // 2 ANNA tokens created per block
    uint256 public startBlock = 0;

    constructor() ERC20("Anna", "ANNA") {
        owner = payable(msg.sender);
        contractAddress = address(this);
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function snapshot() public onlyOwner {
        _snapshot();
    }

    /**
     * Returns the amount of ANNA tokens held by the contract
     */
    function getReserve() public view returns (uint256) {
        return ERC20(contractAddress).balanceOf(address(this));
    }

    function buy(uint256 _amount) public payable {
        // the value of ether that should be equal or greater than tokenPrice * amount;
        uint256 _requiredPayment = tokenPrice * _amount;
        require(msg.value >= _requiredPayment, "Ether sent is incorrect");

        // total tokens + amount <= 10000, otherwise revert the transaction
        uint256 amountWithDecimals = amount * 10**18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountWithDecimals);
    }

    // withdrawl funds from contract
    function fundsWithdraw(uint256 _amount) public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw; contract balance empty");
        require(amount >= _amount, "Inufficient funds for withdrawal");
        (bool sent, ) = owner.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // destruct the contract
    function destruct() external onlyOwner {
        destruct(owner);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }

    /*
    Adds liquidity to the exchange.
    */
    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 currentBalance = getReserve();
        ERC20 ANNA = ERC20(contractAddress);
        /*
            If the reserve is empty, intake any user supplied value for
            `Ether` and `ANNA` tokens because there is no ratio currently
        */
        if (balanceANNA == 0) {
            // Transfer ANNA from the user's account to the contract
            contractANNA.transferFrom(msg.sender, address(this), _amount);
            // Take the current ethBalance and mint `ethBalance` amount of LP tokens to the user.
            // `liquidity` provided is equal to `ethBalance` because this is the first time user
            // is adding `Eth` to the contract, so whatever `Eth` contract has is equal to the one supplied
            // by the user in the current `addLiquidity` call
            // `liquidity` tokens that need to be minted to the user on `addLiquidity` call should always be proportional
            // to the Eth specified by the user
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            /*
                If the reserve is not empty, intake any user supplied value for
                `Ether` and determine according to the ratio how many `Crypto Dev` tokens
                need to be supplied to prevent any large price impacts because of the additional
                liquidity
            */
            // EthReserve should be the current ethBalance subtracted by the value of ether sent by the user
            // in the current `addLiquidity` call
            uint256 ethReserve = ethBalance - msg.value;
            // Ratio should always be maintained so that there are no major price impacts when adding liquidity
            // Ratio here is -> (cryptoDevTokenAmount user can add/cryptoDevTokenReserve in the contract) = (Eth Sent by the user/Eth Reserve in the contract);
            // So doing some maths, (cryptoDevTokenAmount user can add) = (Eth Sent by the user * cryptoDevTokenReserve /Eth Reserve);
            uint256 cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) /
                (ethReserve);
            require(
                _amount >= cryptoDevTokenAmount,
                "Amount of tokens sent is less than the minimum tokens required"
            );
            // transfer only (cryptoDevTokenAmount user can add) amount of `Crypto Dev tokens` from users account
            // to the contract
            cryptoDevToken.transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            // The amount of LP tokens that would be sent to the user should be proportional to the liquidity of
            // ether added by the user
            // Ratio here to be maintained is ->
            // (LP tokens to be sent to the user (liquidity)/ totalSupply of LP tokens in contract) = (Eth sent by the user)/(Eth reserve in the contract)
            // by some maths -> liquidity =  (totalSupply of LP tokens in contract * (Eth sent by the user))/(Eth reserve in the contract)
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }
}
