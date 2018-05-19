export default class Identity {
    constructor(username, identityAddress, privateKey, publicKey = undefined) {
        this.username = username;
        this.identityAddress = identityAddress;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
}
