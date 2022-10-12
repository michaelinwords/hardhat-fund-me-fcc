const network_config = {
    5: {
        name: "goerli",
        eth_usd_price_feed_addr: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137: {
        name: "polygon",
        eth_usd_price_feed_addr: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    },
    // hardhat network?
    // what about chains that don't have price feeds on them? > use a mock contract

}

const development_chains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 // the value is 2000, but we add 8 decimal places

// what is module.exports doing? > it's a property of the module object in node.js,
// a module being a way of breaking our program into chunks
// exports is the object returned to the require() call
// using this allows other files to access these variables
module.exports = {
    network_config,
    development_chains,
    DECIMALS,
    INITIAL_ANSWER,
}