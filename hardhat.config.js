require("@nomicfoundation/hardhat-toolbox")
 // a plugin which adds a deploy task to hardhat; make sure to add a /deploy folder in the project,
 // which will hold all the scripts which will get run when we run yarn hardhat deploy
 require("hardhat-deploy")
 // if we use this deploy, we should also add hardhat-deploy-ethers
 // the next line overrides hardhat-ethers, replacing it with hardhat-deploy-ethers
 // yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
 require("hardhat-deploy-ethers")


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  namedAccounts: { // these are just assigning names for each position in our accounts list, for easy reference
    deployer: { // "give the name 'deployer' to.."
      default: 0, // the first account, by default
      // 4: 1, // if the account is rinkeby (ID 4), then use the account in index 1
      // 31337: 1, // on hardhat, use the account at index 1
    },
    user: {
      default: 1
    }
  },
  // here, we'll make a mock price feed object that we can control and use in testing when working locally;
  // use the mock when using localhost or hardhat
}