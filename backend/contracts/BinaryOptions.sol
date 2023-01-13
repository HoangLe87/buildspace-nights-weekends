// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BinaryOptions {
    AggregatorV3Interface internal priceFeed;
    IERC20 public ANNA;
    IERC20 public LOVE;
    struct Player {
        bool madeABet;
        bool prediction;
        uint256 betAmount;
    }
    uint256 public expiry60min = 3600;
    uint256 public expiry30min = 1800;
    uint256 public expiry15min = 900;
    mapping(address => Player) public players;

    uint256 public startTime;
    uint256 public endTime;
    bool public inProgress;
    uint256 totalTrue;
    uint256 totalFalse;

    event Bet(address, uint256, bool);

    /**
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
     */
    constructor(address _annaAddress, address _loveAddress) {
        priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        ANNA = IERC20(_annaAddress);
        LOVE = IERC20(_loveAddress);
    }

    /**
     * Returns the latest price
     */

    function getHistoricalPrice(uint80 roundId) public view returns (int256) {
        (
            uint80 id,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.getRoundData(roundId);
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    function bet(uint256 _amount, bool _prediction) external {
        require(
            players[msg.sender].madeABet == false &&
                block.timestamp < (startTime + 15 minutes),
            "Unable to place bets now"
        );
        require(
            ANNA.balanceOf(msg.sender) >= _amount && _amount > 0,
            "Insufficient funds"
        );
        ANNA.transferFrom(msg.sender, address(this), _amount);
        players[msg.sender].madeABet = true;
        players[msg.sender].betAmount = _amount;
        players[msg.sender].prediction = _prediction;
        if (_prediction == false) {
            totalFalse += _amount;
            if (
                totalTrue > 1 * 10**18 &&
                !inProgress &&
                (((totalTrue * 100) / totalFalse) >= 50)
            ) {
                startTime = block.timestamp;
                endTime = block.timestamp + 30 minutes;
                inProgress = true;
            }
        } else if (_prediction == true && !inProgress) {
            totalTrue += _amount;
            if (
                totalFalse > 1 * 10**18 &&
                !inProgress &&
                (((totalFalse * 100) / totalTrue) >= 50)
            ) {
                startTime = block.timestamp;
                endTime = block.timestamp + 30 minutes;
                inProgress = true;
            }
        }
        emit Bet(msg.sender, _amount, _prediction);
    }

    function resolve() private {}
}
