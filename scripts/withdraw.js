// running this script with command (after starting local hardhat node):
// yarn hardhat run scripts/withdraw.js --network localhost
const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("** WITHDRAWING from contract **")
    const tx_response = await fundMe.withdraw()
    await tx_response.wait(1)
    console.log("** WITHDRAWAL COMPLETE **")
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})