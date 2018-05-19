import Identity from 'js/lib/Identity';
import web3 from '../web3';

export default class IdentityRepository {
    static IDENTITY_ADDRESS = 'identity_address';
    static ENS_USERNAME = 'ens_username';
    static PRIVATE_KEY = 'private_key';

    constructor() {
        this.ls = window.localStorage;
    }

    getIdentityFromLocalStorage() {
        const identityAddress = this.ls.getItem(Identity.IDENTITY_ADDRESS),
            username = this.ls.getItem(Identity.ENS_USERNAME),
            privateKey = this.ls.getItem(Identity.PRIVATE_KEY);
        if (identityAddress && username && privateKey && identityAddress.length && username.length && privateKey.length) {
            return new Identity(username, identityAddress, privateKey);
        }
        return null;
    }

    storeIdentity(username, identityAddress, privateKey) {
        this.ls.setItem(IdentityRepository.IDENTITY_ADDRESS, identityAddress);
        this.ls.setItem(IdentityRepository.ENS_USERNAME, username);
        this.ls.setItem(IdentityRepository.PRIVATE_KEY, privateKey);
    }

    generateNewPrivateKey() {
        return web3.getWeb3().eth.accounts.create().privateKey;
    }
}
