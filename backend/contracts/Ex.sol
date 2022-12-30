// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ex is ERC20 {
    ERC20 private immutable tok1;
    ERC20 private immutable tok2;
    string public symb1;
    string public symb2;
    address public facAdr;
    address public owner;
    mapping(string => address) public symbAdr;
    // 1% trading and withdrawal fee
    uint256 fee = 990;

    // events
    event Add(address, uint256);
    event Rem(address, uint256);
    event Trade(address, string, uint256, string, uint256, uint256);

    // contructor
    constructor(
        string memory _symb1,
        address _adr1,
        string memory _symb2,
        address _adr2,
        address _owner,
        address _facAdr
    ) ERC20("LP ANNA", "lpANNA") {
        symb1 = _symb1;
        symb2 = _symb2;
        symbAdr[symb1] = _adr1;
        symbAdr[symb2] = _adr2;
        tok1 = ERC20(_adr1);
        tok2 = ERC20(_adr2);
        owner = _owner;
        facAdr = _facAdr;
    }

    // ---------------------- functions ------------------ //

    /**
     * @dev recalculates the amount of tokens held by this contract
     */
    function getRes()
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (
            tok1.balanceOf(address(this)),
            tok2.balanceOf(address(this)),
            totalSupply()
        );
    }

    /**
     * @dev add liquidity to the pool
     */
    function add(string memory _inSymb, uint256 _inAmt)
        external
        returns (uint256)
    {
        (string memory outSymb, uint256 outAmt, uint256 lpTok) = getEst(
            _inSymb,
            _inAmt
        );

        require(_inAmt > 0 && outAmt > 0, "Invalid input");
        require(
            ((ERC20(symbAdr[outSymb])).balanceOf(msg.sender) >= outAmt) &&
                ((ERC20(symbAdr[_inSymb])).balanceOf(msg.sender) >= _inAmt),
            "Insufficient balance"
        );

        ERC20(symbAdr[outSymb]).transferFrom(msg.sender, address(this), _inAmt);
        ERC20(symbAdr[_inSymb]).transferFrom(msg.sender, address(this), _inAmt);

        _mint(msg.sender, lpTok);
        emit Add(msg.sender, lpTok);
        return lpTok;
    }

    function getEst(string memory _inSymb, uint256 _inAmt)
        public
        view
        returns (
            string memory outSymb,
            uint256 outAmt,
            uint256 lpAmt
        )
    {
        (uint256 tok1Res, uint256 tok2Res, uint256 lpIssued) = getRes();
        if (isEqual(_inSymb, symb1)) {
            outSymb = symb2;
            if (lpIssued > 0) {
                require(tok1Res > 0 && tok2Res > 0, "Insufficient reserves");
                outAmt = (_inAmt * tok2Res) / tok1Res;
                lpAmt = ((lpIssued * _inAmt) / tok1Res);
            } else {
                lpAmt = _inAmt;
                outAmt = _inAmt;
            }
        } else if (isEqual(_inSymb, symb2)) {
            outSymb = symb1;
            if (lpIssued > 0) {
                require(tok1Res > 0 && tok2Res > 0, "Insufficient reserves");
                outAmt = (_inAmt * tok1Res) / tok2Res;
                lpAmt = ((lpIssued * _inAmt) / tok2Res);
            } else {
                lpAmt = _inAmt;
                outAmt = _inAmt;
            }
        } else {
            revert("Not found");
        }
        return (outSymb, outAmt, lpAmt);
    }

    /**
     * @dev remove liquidity from the pool
     */
    function rem(uint256 _lpAmt) external returns (bool) {
        (uint256 tok1Amt, uint256 tok2Amt) = getWdrEst(_lpAmt);
        _burn(msg.sender, _lpAmt);
        tok1.transfer(msg.sender, tok1Amt);
        tok2.transfer(msg.sender, tok2Amt);
        emit Rem(msg.sender, _lpAmt);
        return (true);
    }

    // Returns the amount of tokens the user will gets back with withdrawing his lp tokens
    function getWdrEst(uint256 _lpAmt) public view returns (uint256, uint256) {
        (uint256 tok1Res, uint256 tok2Res, uint256 lpIssued) = getRes();
        require(_lpAmt <= balanceOf(msg.sender), "Invalid amount");
        uint256 tok1Amt = ((_lpAmt * fee * tok1Res) / (1000 * lpIssued));
        uint256 tok2Amt = ((_lpAmt * fee * tok2Res) / (1000 * lpIssued));
        return (tok1Amt, tok2Amt);
    }

    /**
     * @dev estimation function: sell _inputAmount and user will get outputAmount
     */
    function sellCalc(
        uint256 _inAmt,
        uint256 _inRes,
        uint256 _outRes
    ) private view returns (uint256) {
        return ((_inAmt * fee * _outRes) / (1000 * _inRes + (_inAmt * fee)));
    }

    function sellEst(string memory _inSymb, uint256 _inAmt)
        public
        view
        returns (string memory outSymb, uint256 outAmt)
    {
        (uint256 tok1Res, uint256 tok2Res, uint256 lpIssued) = getRes();
        require(lpIssued > 0, "Inactive pool");
        require(
            ERC20((symbAdr[_inSymb])).balanceOf(msg.sender) >= _inAmt,
            "Insufficient balance"
        );
        if (isEqual(_inSymb, symb2)) {
            outSymb = symb1;
            outAmt = sellCalc(_inAmt, tok2Res, tok1Res);
        } else if (isEqual(_inSymb, symb1)) {
            outSymb = symb2;
            outAmt = sellCalc(_inAmt, tok1Res, tok2Res);
        } else {
            revert("Invalid request");
        }
        return (outSymb, outAmt);
    }

    // swap function
    function swap(string memory _inSymb, uint256 _inAmt) external {
        (string memory outSymb, uint256 outAmt) = sellEst(_inSymb, _inAmt);
        ERC20(symbAdr[_inSymb]).transferFrom(msg.sender, address(this), _inAmt);
        ERC20(symbAdr[outSymb]).transfer(msg.sender, outAmt);
        emit Trade(
            msg.sender,
            _inSymb,
            _inAmt,
            outSymb,
            outAmt,
            block.timestamp
        );
    }

    // change fee
    function setFee(uint256 _fee) public {
        require(
            _fee >= 500 && _fee <= 1000,
            "Min 500 (50% fee) max 1000 (0% fee)"
        );
        require(msg.sender == owner, "Not owner");
        fee = _fee;
    }

    // ---------------------- utilities ------------------ //
    // destruct the contract
    function kill() public {
        require(msg.sender == facAdr, "Not factory");
        tok1.transfer(owner, tok1.balanceOf(address(this)));
        tok2.transfer(owner, tok1.balanceOf(address(this)));
        selfdestruct(payable(owner));
    }

    function isEqual(string memory _one, string memory _two)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(_one)) ==
            keccak256(abi.encodePacked(_two)));
    }
}
