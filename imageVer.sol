// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ImageVerification {
    mapping(string => bool) public hashes;

    function storeHash(string memory hash) public {
        require(!hashes[hash], "Hash already exists");
        hashes[hash] = true;
    }

    function verifyHash(string memory hash) public view returns (bool) {
        return hashes[hash];
    }
}
