// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ExchangeV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Factory is Ownable {
    // exchanges pairs to exchange address
    mapping(address => mapping(address => address))
        public tokenAddressToExchanges;

    /**
     * create and deploy a new exchange
     * @dev
     * tokenAddress address: Token address for which the factory will create an exchange
     * @return exchangeAddress address: ERC20 token address
     * @notice a similar exchange must not exist
     */
    function createExchange(address _token1Address, address _token2Address)
        external
        onlyOwner
        returns (address exchangeAddress)
    {
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "Token address not valid"
        );
        require(
            tokenAddressToExchanges[_token1Address][_token2Address] ==
                address(0) &&
                tokenAddressToExchanges[_token2Address][_token1Address] ==
                address(0),
            "Exchange already exists"
        );
        Exchange exchange = new Exchange(
            _token1Address,
            _token2Address,
            address(this)
        );
        exchangeAddress = address(exchange);
        tokenAddressToExchanges[_token1Address][
            _token2Address
        ] = exchangeAddress;
        tokenAddressToExchanges[_token2Address][
            _token1Address
        ] = exchangeAddress;
        return exchangeAddress;
    }

    /**
     * remove exchange
     */
    function removeExchange(address _token1Address, address _token2Address)
        public
        onlyOwner
    {
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "Token address not valid"
        );
        require(
            tokenAddressToExchanges[_token1Address][_token2Address] !=
                address(0) &&
                tokenAddressToExchanges[_token2Address][_token1Address] !=
                address(0),
            "Exchange does not exist"
        );
        Exchange(tokenAddressToExchanges[_token1Address][_token2Address])
            .destruct();
        delete tokenAddressToExchanges[_token1Address][_token2Address];
        delete tokenAddressToExchanges[_token2Address][_token1Address];
    }

    /**
     * find exchange
     */
    function getExchange(address _token1Address, address _token2Address)
        public
        view
        returns (address exchange1Address, address exchange2Address)
    {
        exchange1Address = tokenAddressToExchanges[_token1Address][
            _token2Address
        ];
        exchange2Address = tokenAddressToExchanges[_token2Address][
            _token1Address
        ];
        require(
            exchange1Address == exchange1Address,
            "The 2 mapping addresses do not match"
        );
        require(
            exchange1Address != address(0) && exchange2Address != address(0),
            "Exchange does not exist"
        );
        return (exchange1Address, exchange2Address);
    }

    // destruct the contract
    function destruct() internal onlyOwner {
        // remove from mapping
        selfdestruct(payable(owner()));
    }

    // set sellingTax
    function setSellingTax(
        address _token1Address,
        address _token2Address,
        uint256 _sellingTax
    ) external onlyOwner {
        Exchange(tokenAddressToExchanges[_token1Address][_token2Address])
            .setSellingTax(_sellingTax);
        (_sellingTax);
    }

    // set tradingFee
    function settradingFee(
        address _token1Address,
        address _token2Address,
        uint256 _tradingFee
    ) external onlyOwner {
        Exchange(tokenAddressToExchanges[_token1Address][_token2Address])
            .setTradingFee(_tradingFee);
        (_tradingFee);
    }
}
