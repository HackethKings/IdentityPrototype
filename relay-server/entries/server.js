const express = require('express')
import cors from 'cors';
import Web3 from "js/lib/web3";
import Account from 'js/lib/Account';
import Factory from 'js/lib/contracts/Factory';

const app = express()

app.use(cors())

const Web3EthAbi = require('web3-eth-abi');
var contract = require("truffle-contract");

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

async function deploy(name, publicAddress) {
    const newRelay = await Factory.deployNewContract('GasReturnRelay', from);
    //TODO refactor as constructor functions
    await newRelay.setOwner(publicAddress, {from})
    await newRelay.setName(name, {from})
    return newRelay;
}

async function init() {
    let accounts = await Account.getAccounts()
    from = accounts[0];

    let newRelay = await deploy("newguy", "0x0123");
    let newFlip = await deploy("newguy", "0x0123");

    console.log("Name: ", await newRelay.name.call({from}))
    console.log("Address: ", await newRelay.owner.call({from}))

    test(newRelay)
}

async function test(newRelay) {
    const newFlip = await deployFlip();

    console.log("Flip: ", await newFlip.flipped.call({from}))
    console.log("flipping through relay...")

    let data = Web3EthAbi.encodeFunctionSignature('flip()');
    let tx = await executeAndReturnGas(newRelay, newFlip.address, 0, data, 0, 100000);
    //console.log("tx: ", tx)

    console.log("Flip: ", await newFlip.flipped.call({from}))
}

init()

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/deploy', (req, res) => {
    console.log(req.body)
    res(req.body)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
