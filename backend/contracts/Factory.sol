// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ExchangeV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Factory is Ownable {
    // exchanges pairs to exchange address
    mapping(address => mapping(address => address))
        public tokenAddressToExchanges;
    mapping(string => address) public tokenToAdress;

    /**
     * create and deploy a new exchange
     * @dev
     * tokenAddress address: Token address for which the factory will create an exchange
     * @return exchangeAddress address: ERC20 token address
     * @notice a similar exchange must not exist
     */
    function createExchange(address _token1Address, address _token2Address)
        private
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
            owner(),
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

    function createExchangeUsingTokenSymbol(
        string memory _token1,
        string memory _token2
    ) external checkIfExists(_token1, _token2) onlyOwner {
        createExchange(tokenToAdress[_token1], tokenToAdress[_token2]);
    }

    /**
     * remove exchange
     */
    function removeExchange(address _token1Address, address _token2Address)
        private
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

    function removeExchangeUsingTokenSymbol(
        string memory _token1,
        string memory _token2
    ) external checkIfExists(_token1, _token2) onlyOwner {
        removeExchange(tokenToAdress[_token1], tokenToAdress[_token2]);
    }

    /**
     * find exchange
     */
    function getExchange(address _token1Address, address _token2Address)
        private
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

    function getExchangeUsingTokenSymbol(
        string memory _token1,
        string memory _token2
    ) external view checkIfExists(_token1, _token2) {
        getExchange(tokenToAdress[_token1], tokenToAdress[_token2]);
    }

    // destruct the contract
    function destruct() external onlyOwner {
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

    /**
     * add mapping like BNB -> 045x0000 etc
     */
    function addTokenMapping(string memory _token, address _address)
        external
        onlyOwner
    {
        require(
            tokenToAdress[_token] == address(0),
            "Mapping token->address for this token already exist"
        );
        tokenToAdress[_token] = _address;
    }

    // remove token mappings
    function removeTokenMapping(string memory _token) external onlyOwner {
        require(
            tokenToAdress[_token] != address(0),
            "Mapping token->address for this token does not exist"
        );
        tokenToAdress[_token] = address(0);
    }

    function checkMapping(string memory _token)
        external
        view
        returns (address)
    {
        return tokenToAdress[_token];
    }

    modifier checkIfExists(string memory _token1, string memory _token2) {
        require(
            tokenToAdress[_token1] != address(0) &&
                tokenToAdress[_token2] != address(0),
            "Mapping for this token does not exist"
        );
        _;
    }
}
