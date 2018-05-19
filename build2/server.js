const Web3 = require('web3');
const contract = require('truffle-contract');
const fs = require('fs');

const fileContents = fs.readFileSync('../build/contracts/FlipContract.json', 'utf8');
const flipContractArtifacts = JSON.parse(fileContents);
const FlipContract = contract(flipContractArtifacts);

var accounts;
var account;

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
FlipContract.setProvider(web3.currentProvider);
if (typeof FlipContract.currentProvider.sendAsync !== "function") {
    FlipContract.currentProvider.sendAsync = function() {
        return FlipContract.currentProvider.send.apply(
            FlipContract.currentProvider, arguments
        );
    };
}


async function getAccounts() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accs) => {
            if (err != null) {
                console.error("There was an error fetching your accounts.");
                reject(err);
            }
            if (accs.length == 0) {
                console.error("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                reject(err);
            }
            resolve(accs);
        })
    })
}

async function call(params) {
}

async function init() {
    let accounts = await getAccounts()
    account = accounts[0];
    console.log(account)
    instance = await FlipContract.deployed();    

    let counterBefore = await instance.counter.call({from: account})
    console.log('before: ', counterBefore.valueOf());

    let flip = await instance.add.call({from: account})

    

    let counterAfter = await instance.counter.call({from: account})
    console.log('after: ', counterAfter.valueOf());

    let time = await instance.time.call({from: account})
    console.log('time: ', time.valueOf());


}

init()