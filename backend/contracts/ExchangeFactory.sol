// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Exchange.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExchangeFactory is Ownable {
    // exchanges pairs to exchange address
    mapping(address => mapping(address => address))
        public tokenAddressToExchanges;
    mapping(string => address) public tokenToAdress;

    /**
     * create and deploy a new exchange
     */
    function createExchange(address _token1Address, address _token2Address)
        private
        returns (address exchangeAddress)
    {
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
    }

    function createExchangeBySymbol(
        string memory _token1,
        address _token1Address,
        string memory _token2,
        address _token2Address
    ) external {
        // checks
        require(
            _token1Address != address(0) && _token2Address != address(0),
            "Invalid address"
        );
        require(
            tokenAddressToExchanges[_token1Address][_token2Address] ==
                address(0) ||
                tokenAddressToExchanges[_token2Address][_token1Address] ==
                address(0),
            "The pair exists"
        );
        tokenToAdress[_token1] = _token1Address;
        tokenToAdress[_token2] = _token2Address;
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
            "Invalid address"
        );
        require(
            tokenAddressToExchanges[_token1Address][_token2Address] !=
                address(0) &&
                tokenAddressToExchanges[_token2Address][_token1Address] !=
                address(0),
            "Invalid exchange"
        );
        Exchange(tokenAddressToExchanges[_token1Address][_token2Address])
            .destruct();
        delete tokenAddressToExchanges[_token1Address][_token2Address];
        delete tokenAddressToExchanges[_token2Address][_token1Address];
    }

    function removeExchangeBySymbol(
        string memory _token1,
        string memory _token2
    ) external checkIfExists(_token1, _token2) onlyOwner {
        removeExchange(tokenToAdress[_token1], tokenToAdress[_token2]);
    }

    /**
     * find exchange
     */
    function getExchangeBySymbol(string memory _token1, string memory _token2)
        external
        view
        checkIfExists(_token1, _token2)
        returns (address exchange1Address, address exchange2Address)
    {
        exchange1Address = tokenAddressToExchanges[tokenToAdress[_token1]][
            tokenToAdress[_token2]
        ];
        exchange2Address = tokenAddressToExchanges[tokenToAdress[_token2]][
            tokenToAdress[_token1]
        ];
        return (exchange1Address, exchange2Address);
    }

    // destruct the contract
    function destruct() external onlyOwner {
        selfdestruct(payable(owner()));
    }

    // set fee
    function setFee(
        string memory _token1,
        string memory _token2,
        uint256 _tradingFee
    ) external onlyOwner {
        Exchange(
            tokenAddressToExchanges[tokenToAdress[_token1]][
                tokenToAdress[_token2]
            ]
        ).setFee(_tradingFee);
    }

    /**
     * add mapping like BNB -> 045x0000 etc
     */
    function addTokenMapping(string memory _token, address _address)
        external
        onlyOwner
    {
        require(tokenToAdress[_token] == address(0), "Mapping exists");
        tokenToAdress[_token] = _address;
    }

    // remove token mappings
    function removeTokenMapping(string memory _token) external onlyOwner {
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
            "Invalid mapping"
        );
        _;
    }

    // claim ownership if the user's balance is 15k gAnna or more
    function claimOwner() external {
        require(
            ERC20(0xd9145CCE52D386f254917e481eB44e9943F39138).balanceOf(
                msg.sender
            ) >= 15000 * 10**18,
            "Need at least 15k gANNA"
        );
        _transferOwnership(msg.sender);
    }
}