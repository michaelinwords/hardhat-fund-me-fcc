// IMPORTS
const {network_config, development_chains} = require("../helper-hardhat-config")
const {network} = require("hardhat")
const { logger } = require("ethers")
const {verify} = require("../utils/verify")

// the GOAL of this script:
// to be able to deploy to any network without needing to change our solidity code,
// such as the fact that there may or may not be a price feed object live and available

// can write this script in this structure:
// function deployFunc(hre) {}
// module.exports.default = deployFunc

// but we'll define it as an async and anonymous function
// hardhat will auto pass in the hre to this function
// module.exports = async(hre) => {
//     const {getNamedAccounts, deployments } = hre // this is like const something = hre.getNamedAccounts
// }

// and to make it even more compressed:
module.exports = async({getNamedAccounts, deployments}) => {
    // and now we're adding things:
    const { deploy, log } = deployments
    // named accounts is something we define in our hardhat.config.js
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // use a smarter process for defining the address:
    // if chainId == something, do X; else do Y
    // aave uses a helper-hardhat-config file for this
    // const eth_usd_price_feed_addr = network_config[chainId]["eth_usd_price_feed_addr"]
    let eth_usd_price_feed_addr
    if (development_chains.includes(network.name)) {
        // hardhat deploy allows us to just get the most recent deployment (by specifying the contract name)
        const eth_usd_aggregator = await deployments.get("MockV3Aggregator")
        eth_usd_price_feed_addr = eth_usd_aggregator.address
    }
    else {
        eth_usd_price_feed_addr = network_config[chainId]["eth_usd_price_feed_addr"]
    }

    // with hardhat deploy, we don't need a contract factory to deploy;
    // we can use the deploy function by overriding it
    const args = [eth_usd_price_feed_addr]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // will put price feed address in here
        log: true, // do some custom logging
        waitConfirmations: network.config.blockConfirmations || 1, // wait the amount of blocks we define, or just 1 block if undefined; give etherscan time to index our contract
    })

    // VERIFYING:
    // we don't want to verify on a local chain/network
    // so if we're not on a development chain AND we've got an etherscan api key
    if (!development_chains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        // go ahead and verify
        // instead of having our verify code in our deploy code, we're going to put it in a new folder, "utils"
        await verify(fundMe.address, args)
    }

    log("--------------------------------------------")
}

module.exports.tags = ["all", "fundme"]