// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
// how do we handle the fact that there are different versions of solidity used across our different files?
// solution: add multiple solidity versions in our hardhat.config.js > module.exports

// how do we know how to define our mock? well, we could just copy the general script from chainlink,
// but they actually provide a mock; we can just import that file and it will resolve dependencies 
import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";