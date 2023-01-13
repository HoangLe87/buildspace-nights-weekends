// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BinaryOptions {
    AggregatorV3Interface internal priceFeed;
    IERC20 public ANNA;
    IERC20 public LOVE;
    uint public expiry30min = 3600;
    uint public expiry30min = 1800;
    uint public expiry15min = 900;
    uint public startTime = ;
    uint public endTime = ;
    bool public inProgess;
    mapping(address=>mapping(bool=>uint256)) adrToOutcomeToStaked;
    uint totalStakedTrue;
    uint totalStakedFalse;


    event Bet(address, uint256, bool)
    /**
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
     */
    constructor(address _annaAddress, address _loveAddress) {
        priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        ANNA = IERC(_annaAddress);
        LOVE = IERC(_loveAddress);
    }
    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            ,
            /*uint80 roundID*/ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    function outcome() private returns (bool) {
        if 
    } 

    function bet(uint256 _amount, bool _prediction) external {
        require(!inProgess && block.timestamp<endTime, "Unable to place bets now")
        require(ANNA.balanceOf(msg.sender)>=_amount0 && _amount>0, "Insufficient funds");
        ANNA.transferFrom(msg.sender, address(this), _amount);
        if (_prediction==true) {
            totalStakedTrue+=_amount
        } else if (_prediction==false) {
            totalStakedFalse+=_amount
        }
        adrToOutcomeToStaked[msg.sender][_prediction]+=totalStaked;
        emit Bet(msg.sender, _amount, _prediction)
    }

    function resolve() private{

    } 
}