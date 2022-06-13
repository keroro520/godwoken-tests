const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

describe("AccessTxContext", function () {
    it("AccessTxContext", async () => {
        const Storage = await ethers.getContractFactory("AccessTxContext");
        const contract = await Storage.deploy();
        await contract.deployed()

        console.log("TxGasPrice[1]: ", await contract.getLastTxGasPrice());

        await (await contract.updateLastTxGasPrice({gasPrice: 11111})).wait();
        console.log("TxGasPrice[2]: ", await contract.getLastTxGasPrice());
    })
})
