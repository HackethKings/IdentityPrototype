import Identity from 'js/lib/Identity';
import test from 'ethereumjs-wallet';


export default class IdentityRepository {
    static IDENTITY_ADDRESS = 'identity_address';
    static ENS_USERNAME = 'ens_username';
    static PRIVATE_KEY = 'private_key';

    constructor() {
        this.ls = window.localStorage;
    }

    getIdentityFromLocalStorage() {
        const identityAddress = this.ls.getItem(IdentityRepository.IDENTITY_ADDRESS),
            username = this.ls.getItem(IdentityRepository.ENS_USERNAME),
            privateKey = this.ls.getItem(IdentityRepository.PRIVATE_KEY);
        if (identityAddress && username && privateKey && identityAddress.length && username.length && privateKey.length) {
            return new Identity(username, identityAddress, privateKey);
        }
        return null;
    }

    setActiveIdentity(username, identityAddress, privateKey) {
        this.ls.setItem(IdentityRepository.IDENTITY_ADDRESS, identityAddress);
        this.ls.setItem(IdentityRepository.ENS_USERNAME, username);
        this.ls.setItem(IdentityRepository.PRIVATE_KEY, privateKey);


    }

    generateNewWallet() {
        const w = test.generate()
        console.log(w, w.getAddressString(), w.getPublicKeyString(), w.getPrivateKeyString());
        return {
            address: w.getAddressString(),
            privateKey: w.getPrivateKeyString()
        };
        // const w = web3.getWeb3();
        // return w.eth.personal.newAccount();
        // const a = w.eth.accounts;
        // return a.create();
    }

    logout() {
        this.ls.removeItem(IdentityRepository.IDENTITY_ADDRESS);
        this.ls.removeItem(IdentityRepository.ENS_USERNAME);
        this.ls.removeItem(IdentityRepository.PRIVATE_KEY);
    }
}
