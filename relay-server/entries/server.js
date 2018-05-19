const express = require('express')
const app = express()

import cors from 'cors';
import Web3 from "js/lib/web3";
import Account from 'js/lib/Account';
import Factory from 'js/lib/contracts/Factory';
// import {
//     advanceBlock,
//     advanceToBlock,
//     increaseTime,
//     increaseTimeTo,
//     duration,
//     revert,
//     latestTime
// } from 'truffle-test-helpers';
// import {advanceBlock} from 'openzeppelin-solidity/test/helpers/advanceToBlock'
app.use(cors());
app.use(express.json());

const Web3EthAbi = require('web3-eth-abi');
var contract = require("truffle-contract");
const _GasReturnRelay = require('GasReturnRelay.json');

Web3.init()
var from

async function executeAndReturnGas(relay, to, value, data, gasPrice, gasLimit) {
    let tx = await relay.callGasRelayed(to, value, data, gasPrice, gasLimit, {from});
    return tx;
}

async function deployFlip() {
    const flip = await Factory.deployNewContract('FlipContract', from);
    return flip;
}

async function deployRelay(username, publicAddress) {
    const newRelay = await Factory.deployNewContract('GasReturnRelay', from);
    console.log("created new relay at:", newRelay.address)
    //TODO refactor as constructor functions
    await newRelay.setOwner(publicAddress, {from})
    await newRelay.setName(username, {from})
    return newRelay;
}

async function deployENS() {
    const ens = await Factory.ENS();
    console.log("ENS is at:", ens.address)
    //TODO refactor as constructor functions
    return ens;
}

async function saveENS(username, identityAddress) {
    const ens = await Factory.ENS();
    //TODO refactor as constructor functions
    let tx = await ens.setUserIdentityAddress(username, identityAddress, {from})
    return tx
}

async function init() {
    let accounts = await Account.getAccounts()
    from = accounts[0];

    test()
}

async function getRelayInstance(address) {
    let relay = contract(_GasReturnRelay);
    relay.setProvider(Web3.getWeb3().currentProvider);
    relay = await relay.at(address);
    return relay
}

async function test() {
    let newRelay = await deployRelay("newweguy", "0x01213");
    console.log("created relay at:", newRelay.address)

    let newNewRelay = await getRelayInstance(newRelay.address);

    console.log("newnewnew relay:", newNewRelay.address)

    let name = await newNewRelay.name.call({from});
    let address = await newNewRelay.owner.call({from});
    console.log("Name: ", name);
    console.log("Address: ", address);

    const newFlip = await deployFlip();

    console.log("Flip: ", await newFlip.flipped.call({from}))
    console.log("flipping through relay...")

    let data = Web3EthAbi.encodeFunctionSignature('flip()');
    let tx = await executeAndReturnGas(newRelay, newFlip.address, 0, data, 0, 100000);
    //console.log("tx: ", tx)

    console.log("Flip: ", await newFlip.flipped.call({from}))

    let tx2 = await saveENS(name, newRelay.address);
    //console.log("save to ENS tx", tx2);

    let ens = await deployENS();

    let identityAddress = await ens.getIdentityAddress(name, {from})

    console.log("Saved", name, "to ENS at identityAddress:", identityAddress);
}

init()

async function processDeploy(name, address, res) {
    // console.log("got request:");
    // console.log("name:", name, "address:", address)
    let newRelay = await deployRelay(name, address);
    let tx = await saveENS(name, newRelay.address);
    res.send(newRelay.address)
}

async function processExec(relayAddress, to, value, data, gasPrice, gasLimit, res) {
    const relayInstance = await getRelayInstance(relayAddress);
    let tx = await executeAndReturnGas(relayInstance, to, value, data, gasPrice, gasLimit)
    res.send(tx)
}

async function processKey(relayAddress, newKey, res) {
    const relayInstance = await getRelayInstance(relayAddress);
    console.log(newKey,relayAddress);
    let tx = await relayInstance.addKey(newKey,{from});
    res.send(tx)
}

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/deploy', (req, res) => {
    processDeploy(req.body.username, req.body.address, res)
})
app.post('/key', (req, res) => {
    processKey(req.body.identityAddress, req.body.newKey, res)
})
app.post('/exec', (req, res) => {
    processExec(req.body.relayAddress, req.body.to, req.body.value, Web3EthAbi.encodeFunctionSignature(req.body.data), req.body.gasPrice, req.body.gasLimit, res);
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))

function advanceBlock() {
    return new Promise((resolve, reject) => {
        Web3.getWeb3().currentProvider.sendAsync({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: Date.now(),
        }, (err, res) => {
            return err ? reject(err) : resolve(res);
        });
    });
}

setInterval(() => {
    // console.log("advancing");
    advanceBlock();
}, 5 * 1000);
