require("@nomicfoundation/hardhat-toolbox")
 // a plugin which adds a deploy task to hardhat; make sure to add a /deploy folder in the project,
 // which will hold all the scripts which will get run when we run yarn hardhat deploy
 require("hardhat-deploy")
 // if we use this deploy, we should also add hardhat-deploy-ethers
 // the next line overrides hardhat-ethers, replacing it with hardhat-deploy-ethers
 // yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
 require("hardhat-gas-reporter")
 require("@nomiclabs/hardhat-etherscan")
 require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.8"},
      {version: "0.6.6"},
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    }
  },
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
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  }

}