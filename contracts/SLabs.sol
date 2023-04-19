// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//ERC20 SLabs Token with initial supply via constructor parameter
//This token has been used to Mint LabMonster tokens on MonsterGame Contract
//The first version of MonsterGame contract will use 15 SLabs to mint a new LabMonster
contract SLabs is ERC20 {
    constructor(uint256 initialSupply) ERC20("Labs", "SLABS") {
        _mint(msg.sender, initialSupply);
    }
}
