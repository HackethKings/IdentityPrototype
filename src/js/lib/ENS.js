import Factory from 'js/lib/contracts/Factory'

export default class ENS {
    getIdentityAddressByUsername(username) {
        return new Promise(async (resolve) => {
            const ens = await Factory.ENS();
            const res = await ens.getIdentityAddress.call(username);
            resolve(res);
        })
    }

    register(username, address) {
        return new Promise((resolve) => {
            const ens = await Factory.ENS();
            const res = await ens.setUserIdentityAddress(username, address);
            resolve(res);
        })
    }
}
