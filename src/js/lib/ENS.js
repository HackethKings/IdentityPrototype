import Factory from 'js/lib/contracts/Factory'

const USE_MOCKUP = true;

export default class ENS {
    static address;

    getIdentityAddressByUsername(username) {
        return new Promise(async (resolve) => {
            const ens = await Factory.ENS();
            const res = await ens.getIdentityAddress.call(username);
            resolve(res);
        })
    }

    register(username, newAddress) {
        return new Promise((resolve) => {
            if (USE_MOCKUP) {
                address = newAddress;
            } else {
                /**
                 * TODO: Integrate with ENS
                 */
            }
        })
    }
}
