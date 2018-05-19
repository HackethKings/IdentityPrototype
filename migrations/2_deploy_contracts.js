var ClaimHolder = artifacts.require("./ClaimHolder.sol");
var GasReturnRelay = artifacts.require("./GasReturnRelay.sol");
var FlipContract = artifacts.require("./FlipContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ClaimHolder);
  deployer.deploy(GasReturnRelay);
  deployer.deploy(FlipContract);
};
