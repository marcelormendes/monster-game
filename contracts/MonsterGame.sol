// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/ILabMonster.sol";

//Mosnter Contract is responsible to Mint NFT LabMonster Tokens 
//The first mint price decided for mint a monster is 15 SLABS
//The power of this monsters can be between 1 to 100
//The total of monsters for the first version is 5
//All those informations can be updated via the respective functions
//This contract need to be filled with Link to works properly
contract MonsterGame is VRFConsumerBase, Ownable {
    bytes32 public keyhash;
    uint256 public fee;
    address public linkToken;
    address public priceToken;
    address public nftToken;
    uint256 public monsterTotal = 5;
    uint256 public mintPrice = 15 * 10**18;
    uint256 public maxPower = 100;

    mapping(bytes32 => address) public requestIdToSender;
    mapping(uint256 => Monster) public idToMonster;

    event RequestedMonster(
        bytes32 indexed requestId,
        address indexed requester
    );
    event MonsterCreated(
        Monster  monster,
        uint256 indexed tokenId,
        address indexed owner
    );
    struct Monster {
        uint256 power;
        uint256 monsterTypeId;
    }

    constructor(
        address _nftToken,
        address _priceToken,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyhash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        linkToken = _linkToken;
        keyhash = _keyhash;
        fee = _fee;
        nftToken = _nftToken;
        priceToken = _priceToken;
    }

    //Mint a new monster using VRF and spending 15 slabs from the msg.sender
    function requestNewMonster() public {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill the contract"
        );

        IERC20(priceToken).transferFrom(msg.sender, address(this), mintPrice);
        bytes32 requestId = requestRandomness(keyhash, fee);
        requestIdToSender[requestId] = msg.sender;
        emit RequestedMonster(requestId, msg.sender);
    }

    // After ChainLink response generate the power and the monster type id randomly 
    // and create a new tokenid with respective monster
    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        // generate random numbers
        uint256 power = (uint256(keccak256(abi.encode(randomNumber, 1))) %
            maxPower) + 1;
        uint256 monsterTypeId = (uint256(
            keccak256(abi.encode(randomNumber, 2))
        ) % monsterTotal) + 1;

        // mint monster
        address owner = requestIdToSender[requestId];

        uint256 tokenId = ILabMonster(nftToken).mintMonster(owner);

        Monster memory monster = Monster(power, monsterTypeId);
        idToMonster[tokenId] = monster;
        emit MonsterCreated(monster, tokenId, owner);
    }

    /**
     * Requests the address of the Chainlink Token on this network
     */
    function getChainlinkToken() public view returns (address) {
        return address(LINK);
    }

    function getMonsters(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 totalMonsters = ILabMonster(nftToken).balanceOf(_owner);
        if (totalMonsters == 0) {
            return new uint256[](0);
        }

        uint256[] memory ownerMonsters = new uint256[](totalMonsters);

        for (uint256 i = 0; i < totalMonsters; i++) {
            uint256 tokenId = ILabMonster(nftToken).tokenOfOwnerByIndex(
                _owner,
                i
            );
            ownerMonsters[i] = tokenId;
        }

        return ownerMonsters;
    }

    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }

    function updateMonsterTotal(uint256 _monsterTotal) public onlyOwner {
        monsterTotal = _monsterTotal;
    }

    function updateMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function updateKeyHash(bytes32 _keyhash) public onlyOwner {
        keyhash = _keyhash;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateNFTToken(address _nftToken) public onlyOwner {
        nftToken = _nftToken;
    }

    function updatePriceToken(address _priceToken) public onlyOwner {
        priceToken = _priceToken;
    }

    function updateMaxPower(uint256 _maxPower) public onlyOwner {
        maxPower = _maxPower;
    }

    function updateLinkToken(address _linkToken) public onlyOwner {
        linkToken = _linkToken;
    }
}
