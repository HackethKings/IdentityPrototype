const Web3 = require('web3');
import bus from 'js/bus';

let web3;
let ethereum_node;

class MyWeb3 {
    constructor() {
        this.usesInjectedWeb3 = false;
    }

    init() {
        if (typeof window == "undefined") {
            ethereum_node = 'http://localhost:8545';
        } else {
            ethereum_node = 'http://localhost:8545';
        }
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (0 && typeof window !== "undefined" && typeof window.web3 !== 'undefined') {
            console.warn("Using web3 detected from external source.")
            // Use Mist/MetaMask's provider
            web3 = new Web3(window.web3.currentProvider);
            this.usesInjectedWeb3 = true;
        } else {
            console.warn(`No web3 detected. Falling back to ${ethereum_node}`);
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            web3 = new Web3(new Web3.providers.HttpProvider(ethereum_node));
            this.usesInjectedWeb3 = false;
        }
        try {
            if (!web3.isConnected()) {
                bus.$emit('contractInvalid');
            }
        } catch (e) {
            bus.$emit('contractInvalid');

        }
        if (typeof window !== "undefined") {
            window.web3 = web3;
        }

        web3.version.getNetwork((err, netId) => {
            switch (netId) {
                case "1":
                    console.log('This is mainnet')
                    break
                case "2":
                    console.log('This is the deprecated Morden test network.')
                    break
                case "3":
                    console.log('This is the ropsten test network.')
                    break
                case "4":
                    console.log('This is the Rinkeby test network.')
                    break
                case "42":
                    console.log('This is the Kovan test network.')
                    break
                default:
                    console.log('This is an unknown network.')
            }
        });

        web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
            var transactionReceiptAsync;
            interval = interval ? interval : 500;
            transactionReceiptAsync = function (txnHash, resolve, reject) {
                try {
                    web3.eth.getTransactionReceipt(txnHash, function (error, receipt) {

                        if (receipt == null) {
                            setTimeout(function () {
                                transactionReceiptAsync(txnHash, resolve, reject);
                            }, interval);
                        } else {
                            resolve(receipt);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            };

            if (Array.isArray(txnHash)) {
                var promises = [];
                txnHash.forEach(function (oneTxHash) {
                    promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
                });
                return Promise.all(promises);
            } else {
                return new Promise(function (resolve, reject) {
                    transactionReceiptAsync(txnHash, resolve, reject);
                });
            }
        };
    }

    getWeb3() {
        return web3;
    }
}

export default new MyWeb3();
