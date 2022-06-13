const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

describe("Simple DoS Attack", function () {
    it("tx size is large", async () => {
        try {
            const accounts = await ethers.getSigners();
            const account = accounts[0];
            const _txHash =  await ethers.provider.send("eth_sendTransaction", [{
                "from": account.address,
                "gasPrice": "0x1",
                "gas": "0x1",
                "data": `0x${"01".repeat(128 * 1024 + 1)}`
            }]);
            expect("").to.be.equal("failed")
        } catch (e){
            expect(e.toString()).to.be.contains("oversized data")
            return;
        }
    })
})
