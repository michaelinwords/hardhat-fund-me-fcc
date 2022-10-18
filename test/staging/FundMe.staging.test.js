// these are tests we will run (on a testnet) right before deploying to the mainnet
// we're not going to deploy this/do any fixtures (like we did in unit tests) because the staging
// assumes the contract is already deployed *and* we're not using a mock because we're expecting
// there to be what we need on the testnet

const {getNamedAccounts, ethers} = require("hardhat") 
const {development_chains} = require("../../helper-hardhat-config")
const {assert, expect, AssertionError} = require("chai")

// only run this if we're on a testnet chain (if we're on a dev chain, skip this)
// using ternary operator: condition_bool ? "value if true" : "value if false"
// equivalent to: if (condition_bool) {value = "value if true"} else {value = "value if false"}
development_chains.includes(network.name)
? describe.skip // 
: describe("FundMe", async function () {
    let fundMe
    let deployer
    const send_value = ethers.utils.parseEther("1")

    beforeEach(async function () {
        deployer = await (getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe")
    })

    it("allows people to fund and withdraw", async function () {
        await fundMe.fund({value: send_value})
        await fundMe.withdraw()
        const ending_balance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(ending_balance.toString(), "0")
    })
})