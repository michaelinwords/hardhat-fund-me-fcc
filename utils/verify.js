const{run} = require("hardhat")

const verify = async(contract_address, args) => {
    // hardhat supports using plugins; we'll use the etherscan plugin to do verification
    // need to have API key from etherscan (first, log in to etherscan via browser) and define etherscan dictionary with apikey in hardhat.config.js
    // once we add this, if we run yarn hardhat, we'll see that hardhat has auto checked for any new plugins, and we see "verify" as new option
    console.log("VERIFYING - started verifying contract on etherscan")
    // to use this "run" line, need to add "run" to require statement above from hardhat; run("verify:verify", {}) is like "yarn hardhat verify"
    // the first parameter in the run line is the subtask and the second parameter is the actual arguments to be passed
    // sometimes, etherscan will already have our contract verified, so trying to reverify will throw an error
    try {
      // here, we specify a task:subtask, then {parameters}
      await run("verify:verify", {
        address: contract_address,
        constructorArguments: args,
      })
    }
    catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("error > contract is already verified on etherscan")
      }
      else {
        console.log(e)
      }
    }
    
    console.log("VERIFIED - contract verified on etherscan")
  }

  module.exports = {verify}