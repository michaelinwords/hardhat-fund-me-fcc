// running this script with command (after starting local hardhat node):
// yarn hardhat run scripts/fund.js --network localhost
const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("** FUNDING CONTRACT **")
    const tx_response = await fundMe.fund({value: ethers.utils.parseEther("0.1")})
    await tx_response.wait(1)
    console.log("-- CONTRACT FUNDED --")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })