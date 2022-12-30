// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Ex.sol";

contract ExFac is Ownable {
    mapping(address => mapping(address => address)) public adrEx; // e.g. BNB -> ANNA -> BNB-ANNA
    mapping(string => address) public symbAdr; // e.g. ANNA -> 0x...

    // events
    event Add(address, string, string);
    event Remove(bool, string, string);

    /**
     * add, remove and get exchange
     */
    function addEx(
        string memory _symb1,
        address _adr1,
        string memory _symb2,
        address _adr2
    ) external onlyOwner returns (address exAdr) {
        require(_adr1 != address(0) && _adr2 != address(0), "Invalid address");
        require(adrEx[_adr1][_adr2] == address(0), "Already exists");
        symbAdr[_symb1] = _adr1;
        symbAdr[_symb2] = _adr2;
        Ex exchg = new Ex(_symb1, _adr1, _symb2, _adr2, owner(), address(this));
        exAdr = address(exchg);
        require(exAdr != address(0));
        adrEx[_adr1][_adr2] = exAdr;
        adrEx[_adr2][_adr1] = exAdr;
        emit Add(exAdr, _symb1, _symb2);
        return exAdr;
    }

    function remEx(string memory _symb1, string memory _symb2)
        external
        onlyOwner
    {
        address adr1 = symbAdr[_symb1];
        address adr2 = symbAdr[_symb2];
        require(adrEx[adr1][adr2] != address(0), "Invalid input");
        Ex(adrEx[adr1][adr2]).kill();
        delete adrEx[adr1][adr2];
        delete adrEx[adr2][adr1];
        emit Remove(true, _symb1, _symb2);
    }

    function getEx(string memory _symb1, string memory _symb2)
        external
        view
        returns (address ex1Adr)
    {
        ex1Adr = adrEx[symbAdr[_symb1]][symbAdr[_symb2]];
        return (ex1Adr);
    }

    /**
     * utilities
     */
    function kill() external onlyOwner {
        selfdestruct(payable(owner()));
    }

    function claimOwner() external {
        require(
            ERC20(0x484AC746C5a960E6F9440D956A45CBe7ce4d123a).balanceOf(
                msg.sender
            ) >= 15000 * 10**18,
            "Need at least 15k gANNA"
        );
        _transferOwnership(msg.sender);
    }
}
