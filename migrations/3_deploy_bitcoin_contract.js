var BitcoinPriceStoppper = artifacts.require("./BitcoinPriceStoppper.sol");

module.exports = function(deployer) {
  deployer.deploy(BitcoinPriceStoppper, 9999);
};
