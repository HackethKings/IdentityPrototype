var IdentityGasRelay = artifacts.require("./IdentityGasRelay.sol");
var FlipContract = artifacts.require("./FlipContract.sol");
var ENS = artifacts.require("./ENS.sol");

module.exports = function(deployer) {
  deployer.deploy(IdentityGasRelay);
  deployer.deploy(FlipContract);
  deployer.deploy(ENS);
};
