const express = require('express')
const app = express()

import cors from 'cors';
import Web3 from "js/lib/web3";
import Account from 'js/lib/Account';
import Factory from 'js/lib/contracts/Factory';
import ethjswallet from 'ethereumjs-wallet';
import ethjsutil from 'ethereumjs-util';
import abi from 'ethereumjs-abi'
import sha3 from 'js-sha3';

const BN = ethjsutil.BN;

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
const _IdentityGasRelay = require('IdentityGasRelay.json');

Web3.init()
var from

async function executeAndReturnGas(relay, to, value, data, gasPrice, gasLimit, signatures) {
    let tx = await relay.callGasRelayed(to, value, data, gasPrice, gasLimit, signatures, {from});
    return tx;
}

async function deployFlip() {
    const flip = await Factory.deployNewContract('FlipContract', from);
    return flip;
}

async function deployRelay(username, publicAddress) {
    const newRelay = await Factory.deployNewContract('IdentityGasRelay', from);
    console.log("created new relay at:", newRelay.address)
    //TODO refactor as constructor functions
    let newKey = await newRelay.setOwner(publicAddress, {from})
    console.log("set a new public key:", newKey.logs[0].event)
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
    let relay = contract(_IdentityGasRelay);
    relay.setProvider(Web3.getWeb3().currentProvider);
    relay = await relay.at(address);
    return relay
}

async function test() {
    let nickname = "newguy"

    const w = ethjswallet.generate()
    let ownerPrivateKey = w.getPrivateKeyString();
    let ownerPublicKey = w.getPublicKeyString();
    let ownerAddress = w.getAddressString();

    console.log("\n-----------")

    console.log("address:", ownerAddress, "\nprivatekey:", ownerPrivateKey, "\npublicKey:", ownerPublicKey);
    
    console.log("\n-----------")

    let newRelay = await deployRelay(nickname, ownerAddress);

    //let newNewRelay = await getRelayInstance(newRelay.address);
    let newNewRelay = newRelay;

    console.log("newnewnew relay:", newNewRelay.address)

    let name = await newNewRelay.name.call({from});
    let address = await newNewRelay.owner.call({from});
    console.log("Name: ", name);
    console.log("Address: ", address);

    // let res = await newNewRelay.removeKey("0x123", 2, {from});
    // console.log("Remove result:", res.logs[0].event)

    console.log("\n-----------")

    const newFlip = await deployFlip();
    let flipAddress = newFlip.address
    console.log("Created Flip: ", flipAddress)

    console.log("Flip: ", await newFlip.flipped.call({from}))

    console.log("\n-----------")

    // console.log("flipping through relay...")

    // let callPrefix = await newNewRelay.CALL_PREFIX.call({from});
    // console.log("callPrefix from contract:", callPrefix)

    let callPrefix = "0x"+sha3.keccak256('callGasRelayed(address,uint256,bytes32,uint256,uint256,address)').substr(0,8)
    console.log('hash:', callPrefix);

    let data = Web3EthAbi.encodeFunctionSignature('flip()');
    console.log('data:', data)

    let dataHash = "0x"+sha3.keccak256(data);
    console.log('dataHash:', dataHash);

    let callPrefixBN = new BN(callPrefix, 16)
    let addressBN = new BN(newNewRelay.address, 16)
    let dataHashBN = new BN(dataHashBN, 16)
    let flipAddressBN = new BN(flipAddress, 16)
    let gasLimit = 100000;

    console.log("\n-----------")

    let callGasRelayHash = abi.soliditySHA3(
        [ "address", "bytes4", "address", "uint", "bytes32", "uint", "uint" ],
        [ addressBN, callPrefix, flipAddressBN, 0, dataHash, 0, gasLimit ]
    ).toString('hex')
    console.log("  our hash:", "0x"+callGasRelayHash);

    let callGasRelayHashContract = await newNewRelay.callGasRelayHash(flipAddress, 0, dataHash, 0, gasLimit, {from});
    console.log("their hash:", callGasRelayHashContract)

    console.log("\n-----------")

    const signPrefix = "\x19Ethereum Signed Message:\n32";
    let ourSignHash = "0x"+abi.soliditySHA3(
        [ "string", "bytes32" ],
        [ signPrefix, callGasRelayHash ]
    ).toString('hex')
    console.log("  our signHash:", ourSignHash)

    let signHashContract = await newNewRelay.getSignHash(callGasRelayHash, {from});
    console.log("their signHash:", signHashContract)

    console.log("\n-----------")

    let signature = ethjsutil.ecsign(ethjsutil.toBuffer(ourSignHash), ethjsutil.toBuffer(ownerPrivateKey));
    
    let r = ethjsutil.bufferToHex(signature.r)
    let s = ethjsutil.bufferToHex(signature.s)
    let v = signature.v

    console.log("r:", r, "\ns:", s, "\nv:", v)

    let signPacked = "0x"+abi.solidityPack(
        [ "bytes32", "bytes32", "uint8" ],
        [ [...signature.r], [...signature.s], v ]
    ).toString("hex")

    console.log("\nsignPacked:", signPacked)

    // let recovery = ethjsutil.ecrecover(ethjsutil.toBuffer("0x"+ourSignHash), v, signature.r, signature.s);
    // console.log("recovered:", ethjsutil.bufferToHex(recovery))

    let signatureSplit = await newNewRelay.signatureSplit(signPacked, 0, {from})

    console.log("\nsignSplit v:", signatureSplit[0].toNumber())
    console.log("signSplit r:", signatureSplit[1])
    console.log("signSplit s:", signatureSplit[2])

    console.log("\n-----------")

    let recovered = await newNewRelay.recoverKey(ourSignHash, signPacked, 0, {from})
    console.log("recovered address:", recovered);

    let verify = await newNewRelay.verifySignatures(2, ourSignHash, signPacked, {from})
    console.log("sign verified:", verify);

    console.log("\n-----------")

    let tx = await executeAndReturnGas(newNewRelay, flipAddress, 0, data, 0, gasLimit, signPacked)
                // executeAndReturnGas(newRelay, newFlip.address, 0, data, 0, 100000);
    console.log("Flip relay tx: ", tx.logs[0].event)

    console.log("Flip: ", await newFlip.flipped.call({from}))

    console.log("\n-----------")

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
