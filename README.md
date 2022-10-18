# HARDHAT FUND ME - FREE CODE CAMP TUTORIAL

## Notes:
- We can run "yarn hardhat deploy --tags mocks" to only deploy scripts which are tagged with "mocks"; we tag a script by defining its tags in module.exports.tags = []
- Every time we run a node with "yarn hardhat node" now, it will automatically have our deployed contracts running on it

## Solidity Styling:
- order of sections in a contract: license, pragma, error codes, interfaces/libraries, contracts
- NatSpec format (Ethereum Natural Language Specification Format): a way of documenting code, use when a part of our code needs more explaining; can generate documentation using solc: solc --userdoc --devdoc ex1.sol
    > some of the @s used are: @title, @author, @notice, @dev, @return, @param
    > in each contract, library or interface, use the following order: (1) type declarations, (2) state variables, (3) events, (4) modifiers, (5) functions
    > group functions by: constructor, receive, fallback, external, public, internal, private, view/pure

## Testing:
- unit tests are done locally; test minimal portions of our code
- staging/integration tests are run on the testnet (while being considerate of testnet use); last step before fully deploying
- commands: yarn hardhat test; yarn hardhat coverage
- place breakpoints in code by clicking on the left side (near line number) to place a red dot - this is where the code will stop executing; if we open a js debug terminal, we can look at the state/variables as the code executes, while paused
- solidity console.log; if we're in a hardhat project, import "hardhat/console.sol" and then we can just use console.log as usual (including string interpolation/formatting)

## Gas Optimisation:
- first step is to ask: for state variables, how are they being stored?
- "storage" is a giant array/list of all the variables we create, literally going down our contract and storing (something about) each state variable in a list (variables with dynamic values, like arrays, are stored using a hashing function)
    > for example, with a list, when the list is mentioned, the storage records its length; the first time it's mentioned, it doesn't store the whole array because the array may be too big to fit in that slot; that's where subsequent slots may reference the array values with hashing (dictionary look-up)
- constant and immutable variables do not take up storage space; they get written directly into the contract's byte code
- variables within a function don't persist outside the function, so they don't get added to storage (they are handled in memory?)
- anytime we write to storage, a lot of gas is spent; the opcodes (which we can see in our contract details) represents the literal computational work required to execute our code (adding requires 3 gas, multiplying 5 gas, subtracting 3 gas, etc; see values at github.com/cryptic/evm-opcodes)
    > sload (800 gas) and sstore (20000 gas) are two of the most expensive gas functions, due to their frequent usage
- due to this interaction with storage being expensive, it is common practice to append any variable with s (s_variable) so we know it is interacting with storage (and i for immutables, like i_variable; and CAPS for CONSTANTS)
- private and internal variables are also cheaper
- it's also cheaper to revert and store error codes  than to store requires with long strings

## Other Notes:
- remember, we can add a "scripts": {} section to our package.json to make running scripts a lot easier
