import Web3 from "js/lib/web3"
var contract = require("truffle-contract");

Web3.init()
const web3 = Web3.getWeb3()
let account0 = web3.eth.accounts[0];

console.log(account0)
console.log(web3.fromWei(web3.eth.getBalance(account0)).toNumber(), 'ETH');


function build(currentProvider) {
    let FlipContract = require("../../build/contracts/FlipContract.json");
    let flipContract = contract(FlipContract);
    flipContract.setProvider(currentProvider);
    return fixTruffleContractCompatibilityIssue(flipContract);
}

// Workaround for a compatibility issue between web3@1.0.0-beta.29 and truffle-contract@3.0.3
// https://github.com/trufflesuite/truffle-contract/issues/57#issuecomment-331300494
function fixTruffleContractCompatibilityIssue(contract) {
    if (typeof contract.currentProvider.sendAsync !== "function") {
        contract.currentProvider.sendAsync = function() {
            return contract.currentProvider.send.apply(
                contract.currentProvider, arguments
            );
        };
    }
    return contract;
}

  
let flipContract = build(web3);

flipContract.deployed();

// then(function(deployed) {
//     return deployed.flip();
// });