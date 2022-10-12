// if we're on a chain that doesn't have price feeds, we'll deploy our own mock feeds/contracts/versions to interact with
const {network} = require("hardhat")
const {development_chains, DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    // named accounts is something we define in our hardhat.config.js
    const { deployer } = await getNamedAccounts()
    const chain_id = network.config.chainId

    // only deploy this if the network doesn't have actual price feeds 
    // (we'll define these as our development chains)
    if (development_chains.includes(network.name)) {
        log("\nLOCAL NETWORK DETECTED - deploying mocks ..")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            // pass the constructor parameters, defined in the contract as (we looked this up): (decimals, initialanswer)
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("MOCK(S) DEPLOYED")
        log("--------------------------------------------")
    }

}

module.exports.tags = ["all", "mocks"]