var ClaimHolder = artifacts.require("./ClaimHolder.sol");
var IdentityGasRelay = artifacts.require("./IdentityGasRelay.sol");
var FlipContract = artifacts.require("./FlipContract.sol");
var ENS = artifacts.require("./ENS.sol");

module.exports = function(deployer) {
  // deployer.deploy(ClaimHolder);
  deployer.deploy(IdentityGasRelay);
  deployer.deploy(FlipContract);
  deployer.deploy(ENS);
};
