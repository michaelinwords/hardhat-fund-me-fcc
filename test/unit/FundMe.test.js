const {deployments, ethers, getNamedAccounts} = require("hardhat")
const {assert, expect, AssertionError} = require("chai")
const {development_chains} = require("../../helper-hardhat-config")

// if we're on a testnet, skip these
!development_chains.includes(network.name)
? describe.skip
: describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator

    // const send_value = "1000000000000000000" // 1 with 18 zeroes = 1 eth
    // or to make it easier to read:
    const send_value = ethers.utils.parseEther("1") // also look into parseUnits function

    beforeEach(async function () {
        // deploy our fundme contract, using hardhat deploy (which will make use of our mocks)
        // fixture: will run through our deploy script (everything in our deploy folder) on our local host/network
        deployer_addr = (await getNamedAccounts()).deployer
        // the line above is similar to this one below: returns whatever's in our accounts section within hardhat config
        // const accounts = await ethers.getSigners()
        // const account_0 = accounts[0]
        await deployments.fixture(["all"])
        // the .getContract function comes from hardhat-deploy; gets the most recent deployment of a named contract
        fundMe = await ethers.getContract("FundMe", deployer_addr)
        // get our mock contract and attach it to our deployer as well
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer_addr)
    })

    describe("constructor", async function() {
        it("sets the aggregator addresses correctly", async function () {
            // why is this a function? when there is no explicit function in fundme
            const response = await fundMe.get_price_feed();
            // check that we are correctly assigning the price feed address to the mockv3aggregator
            assert.equal(response, mockV3Aggregator.address);
        })
    })

    describe("fund", async function () {
        // check that the contract fails if not enough eth is sent
        it("fails if you don't send enough eth", async function () {
            await expect(fundMe.fund()).to.be.reverted
        })
        it("updates the amount funded data structure", async function () {
            await fundMe.fund({value: send_value})
            const response = await fundMe.get_address_to_amount_funded(deployer_addr);
            assert.equal(response.toString(), send_value.toString())
        })
        it("adds funder to array of funders", async function () {
            await fundMe.fund({value: send_value})
            const funder_addr = await fundMe.get_funder(0)
            // check that the funder and deployer address are the same
            assert.equal(funder_addr, deployer_addr)
        })
    })

    describe("withdraw", async function () {
        // add some eth to the contract before testing
        beforeEach(async function () {
            await fundMe.fund({value: send_value})
        })
        it("withdraws eth from a single founder", async function () {
            // arrange
            // since this is calling from the blockchain (.getBalance), it will of type BigNumber
            const starting_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const starting_deployer_bal = await fundMe.provider.getBalance(deployer_addr)

            // act
            const tx_response = await fundMe.withdraw()
            const tx_receipt = await tx_response.wait(1)
            const ending_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const ending_deployer_bal = await fundMe.provider.getBalance(deployer_addr)

            // assert
            // check that the contract is empty
            assert.equal(ending_contract_bal, 0)
            // can find the gas balance from our transaction receipt
            const {gasUsed, effectiveGasPrice} = tx_receipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            assert.equal(starting_contract_bal.add(starting_deployer_bal), ending_deployer_bal.add(gasCost).toString())

        })

        it("allows us to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners()
            // start with i = 1 because 0 will be the deployer
            for (let i = 1; i < 6; i++) {
                // need to connect a certain account each time we want to call a function/do a transaction,
                // and the previously connected account was the deployer
                const fund_me_connected_contract = await fundMe.connect(accounts[i])
                await fund_me_connected_contract.fund({value: send_value})
            }
            const starting_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const starting_deployer_bal = await fundMe.provider.getBalance(deployer_addr)
          
            // act
            const tx_response = await fundMe.withdraw()
            const tx_receipt = await tx_response.wait(1)

            const {gasUsed, effectiveGasPrice} = tx_receipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const ending_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const ending_deployer_bal = await fundMe.provider.getBalance(deployer_addr)

            // assert
            assert.equal(ending_contract_bal, 0)
            assert.equal(starting_contract_bal.add(starting_deployer_bal).toString(), ending_deployer_bal.add(gasCost).toString())

            // make sure the funders are reset properly
            // (1) the zero-th position should throw an error
            await expect(fundMe.get_funder(0)).to.be.reverted;
            for (i = 1; i < 6; i++) {
                // (2) all the mapping values should be set to 0
                assert.equal(await fundMe.get_address_to_amount_funded(accounts[i].address), 0)
            }
        })

        it("allows us to withdraw, cheaper / with gas optimisations", async function () {
            const accounts = await ethers.getSigners()
            // start with i = 1 because 0 will be the deployer
            for (let i = 1; i < 6; i++) {
                // need to connect a certain account each time we want to call a function/do a transaction,
                // and the previously connected account was the deployer
                const fund_me_connected_contract = await fundMe.connect(accounts[i])
                await fund_me_connected_contract.fund({value: send_value})
            }
            const starting_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const starting_deployer_bal = await fundMe.provider.getBalance(deployer_addr)
          
            // act
            const tx_response = await fundMe.cheaper_withdraw()
            const tx_receipt = await tx_response.wait(1)

            const {gasUsed, effectiveGasPrice} = tx_receipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const ending_contract_bal = await fundMe.provider.getBalance(fundMe.address)
            const ending_deployer_bal = await fundMe.provider.getBalance(deployer_addr)

            // assert
            assert.equal(ending_contract_bal, 0)
            assert.equal(starting_contract_bal.add(starting_deployer_bal).toString(), ending_deployer_bal.add(gasCost).toString())

            // make sure the funders are reset properly
            // (1) the zero-th position should throw an error
            await expect(fundMe.get_funder(0)).to.be.reverted;
            for (i = 1; i < 6; i++) {
                // (2) all the mapping values should be set to 0
                assert.equal(await fundMe.get_address_to_amount_funded(accounts[i].address), 0)
            }
        })

        it("allows only the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            // let's say the first account is some random attacker
            // attacker is an account object
            const attacker = accounts[1];
            const attacker_connected_contract = await fundMe.connect(attacker);
            // use "reverted" in general, "revertedWith" when checking for a default error kind, or "revertedWithCustomError" when we define our own error code
            await expect(attacker_connected_contract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        })
    })
})