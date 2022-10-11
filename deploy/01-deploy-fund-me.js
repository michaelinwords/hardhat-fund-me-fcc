// IMPORTS

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
}