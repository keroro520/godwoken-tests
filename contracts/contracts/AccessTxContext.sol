// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract AccessTxContext {
    uint public lastTxGasPrice;

    constructor () payable {
    }

    function getLastTxGasPrice() public view returns(uint) {
        return lastTxGasPrice;
    }

    function updateLastTxGasPrice() public payable {
        lastTxGasPrice = tx.gasprice;
    }
}
