// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILabMonster {
    function mintMonster(address owner) external returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}
