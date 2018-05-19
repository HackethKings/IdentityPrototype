import axios from 'axios';
import web3 from 'js/lib/web3';

import Tx from "ethereumjs-tx";
import IdentityRepository from "./repositories/IdentityRepository";

export default class Relay {
    static RELAY_HOST = 'http://localhost:3000';

    addNewPublicKey(identityAddress, newPublicKey) {
        return new Promise(async (resolve, reject) => {
            //1. generate transaction
            //username, address: newPublicKey
            // construct the transaction data
            const from = (new IdentityRepository()).getIdentityFromLocalStorage().address;
            const privKey = (new IdentityRepository()).getIdentityFromLocalStorage().privateKey;
            const txCount = await web3.getWeb3().eth.getTransactionCount(from);
            const txData = {
                nonce: web3.getWeb3().utils.toHex(txCount),
                gasLimit: web3.getWeb3().utils.toHex(25000),
                gasPrice: 0,
                to: identityAddress,
                from: from,
                value: 0
            };

            const privateKey = new Buffer(privKey, 'hex');
            const transaction = new Tx(txData);
            transaction.sign(privateKey);
            const serializedTx = transaction.serialize().toString('hex');

            //2. send to relay
            const res = await axios.post(Relay.RELAY_HOST + '/key', {tx: serializedTx});
            resolve(res);
        });
    }

    deploy(username, newPublicKey) {
        return new Promise(async (resolve, reject) => {
            const res = await axios.post(Relay.RELAY_HOST + '/deploy', {username, address: newPublicKey});
            resolve(res.data);
        });
    }

    exec(params) {
        return new Promise(async (resolve, reject) => {
            const res = await axios.post(Relay.RELAY_HOST + '/exec', params);
            resolve(res.data);
        });
    }
}
