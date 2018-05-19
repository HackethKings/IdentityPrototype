var ClaimHolder = artifacts.require("./ClaimHolder.sol");
var GasReturnRelay = artifacts.require("./GasReturnRelay.sol");
var FlipContract = artifacts.require("./FlipContract.sol");
var IdentityRegistration = artifacts.require("./IdentityRegistration.sol");

module.exports = function(deployer) {
  // deployer.deploy(ClaimHolder);
  // deployer.deploy(GasReturnRelay);
  // deployer.deploy(FlipContract);
  deployer.deploy(IdentityRegistration);
};
