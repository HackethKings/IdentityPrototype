import RelayRequest from './RelayRequest';

export default class Relay {
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
            //fetch('/deploy')
            //Store in local storage:
            //1. our new private key
            //2. smart contract address
            //3. ens username
            const res = await RelayRequest.fetch(RelayRequest.DEPLOY_ENDPOINT);
            resolve();
        });
    }
}
