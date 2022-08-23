const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isGwMainnetV1 } = require("../utils/network");

const BASE_GAS = 21000;
const SUCCESS_TX_STATUS = 1;
const FAIL_TX_STATUS = 0;

describe("Native Transfer", function() {
    if (isGwMainnetV1()) {
        return;
    }

    it("transfer value 1", async function () {
        await transferValueAndAssert(1, BASE_GAS, SUCCESS_TX_STATUS);
    });

    it("transfer value 0", async function () {
        // await transferValueAndAssert(0, BASE_GAS, SUCCESS_TX_STATUS);
    });

    it("transfer with non-empty data", async function () {
    });

    // TODO Acceptance Team would do it
    // it("transfer with gasLimit lower than base gas", async function () {
    //     const tooSmallGas = BASE_GAS - 1;
    //     await transferValueAndAssert(1, tooSmallGas, FAIL_TX_STATUS);
    // });

    it("transfer to non-existant account", async function () {
    });

    // TODO Acceptance Team would do it
    // it("transfer to contract account", async function () {
    // });
});

async function transferValueAndAssert(value, gas, expectedTxStatus) {
    const sender = (await ethers.getSigners())[0].address;
    const receiver = (await ethers.getSigners())[1].address;
    const senderBalance = Number(await ethers.provider.send("eth_getBalance", [sender, "latest"]));
    const receiverBalance = Number(await ethers.provider.send("eth_getBalance", [receiver, "latest"]));

    const txHash = await ethers.provider.send("eth_sendTransaction", [
        {
            from: sender,
            to: receiver,
            value: "0x" + value.toString(16),
            gas: "0x" + gas.toString(16),
        },
    ]);
    await txHash;

    while (true) {
        let txReceipt = await ethers.provider.getTransactionReceipt(txHash);
        expect(txReceipt.status).to.eq(expectedTxStatus);

        const tipNumber = await ethers.provider.getBlockNumber();
        if (txReceipt.blockNumber === tipNumber) {
            if (txReceipt.status === SUCCESS_TX_STATUS) {
                expect( Number(await ethers.provider.send("eth_getBalance", [sender, "latest"])) ).to.lt(senderBalance - value);
                expect( Number(await ethers.provider.send("eth_getBalance", [receiver, "latest"])) ).to.eq(receiverBalance + value);
            } else {
                expect( Number(await ethers.provider.send("eth_getBalance", [receiver, "latest"])) ).to.eq(receiverBalance);
            }

            break;
        }
        //TODO sleep and timeout
    }
}
