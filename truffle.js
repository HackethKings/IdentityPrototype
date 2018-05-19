var HDWalletProvider = require("truffle-hdwallet-provider");
// reference to mnemonic that generates your accounts.
var mnemonic = "galaxy avoid gain island history sting actress earn alien there tool pair";

require("babel-register")({
    ignore: /node_modules(?!\/zeppelin-solidity)/,
    presets: [
        ["env", {
            "targets" : {
                "node" : "8.0"
            }
        }]
    ],
    retainLines: true,
});
//require("babel-polyfill");

module.exports = {
    networks: {
            development: {
              host: "localhost",
              port: 8545,
              network_id: "*",
              gas: 4712388
            },
/*        ropsten: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/mQQVP2DgogtqNwN1ZQoL");
            },
            network_id: 3
        }*/
    }
};
