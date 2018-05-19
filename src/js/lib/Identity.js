export default class Identity {
    /**
     *
     * @param username
     * @param identityAddress
     * @param privateKey
     * @param address
     */
    constructor(username, identityAddress, privateKey, address = undefined) {
        this.username = username;
        this.identityAddress = identityAddress;
        this.privateKey = privateKey;
        this.address = address;
    }
}
