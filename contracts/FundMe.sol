// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// to use this line in hardhat: yarn add --dev @ chainlink/contracts (remove space after @)
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// this is a styling convention that helps us know which contract is throwing which error
error FundMe__NotOwner();

/** @title A contract for crowd funding
 *  @author Ahn Michael
 *  @notice A demo of a sample funding contract
 *  @dev This implements price feeds as our library
 */
contract FundMe {
    // (1) type declarations
    using PriceConverter for uint256;

    // event Funded(address indexed from, uint256 amount);

    // (2) state variables
    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;

    AggregatorV3Interface public s_price_feed;

    // (3) modifiers
    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
    
    constructor(address price_feed_addr) { 
        i_owner = msg.sender;
        s_price_feed = AggregatorV3Interface(price_feed_addr);
    }

    receive() external payable {
        fund();
    }
    
    fallback() external payable {
        fund();
    }

    /**
     *  @notice This function funds this contract
     *  @dev This implements price feeds as our library
     */
    function fund() public payable {
        require(msg.value.getConversionRate(s_price_feed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        // emit Funded(msg.sender, msg.value);
    }
    
    // function getVersion() public view returns (uint256){
    //     // ETH/USD price feed address of Goerli Network.
    //     // AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    //     return price_feed.version();
    // }
    
    function withdraw() public onlyOwner {
        // gas consideration: because we're saying while funderIndex < s_funders.length, 
        // this means the longer our funders list is/the more people fund the contract,
        // the more gas the withdraw function will spend
        for (uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()

    // this is the same as the above withdraw function, but cheaper/with gas optimisations
    function cheaper_withdraw() public payable onlyOwner {
        // read entire array into memory once
        address[] memory funders = s_funders;
        // IMPORTANT: mappings can't be in memory
        // now, we are referencing our funders.length from memory, not s_funders.length (from storage)
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // break down this line:
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }
}