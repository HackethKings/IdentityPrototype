import RelayRequest from './RelayRequest';
import axios from 'axios';

export default class Relay {
    static RELAY_HOST = 'http://localhost:3000';

    login(identityAddress, newPublicKey) {
        return new Promise(async (resolve, reject) => {
            //1. generate transaction
            //2. send to relay
            //fetch('/login')
            const res = await RelayRequest.fetch(RelayRequest.LOGIN_ENDPOINT);
            resolve();
        });
    }

    deploy(username, newPublicKey) {
        return new Promise(async (resolve, reject) => {
            const res = await axios.post(Relay.RELAY_HOST + '/deploy', {username, address: newPublicKey});
            resolve(res);
        });
    }
}
