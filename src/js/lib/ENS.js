const USE_MOCKUP = true;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class ENS {
    static address;
    getIdentityAddressByUsername(username) {
        return new Promise((resolve) => {
            if (USE_MOCKUP) {
                if (typeof address !== 'undefined') {
                    resolve(address);
                } else {
                    resolve(ZERO_ADDRESS);
                }
            } else {
                /**
                 * TODO: Integrate with ENS
                 */
            }
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
