var GasReturnRelay = artifacts.require("./GasReturnRelay.sol");
var FlipContract = artifacts.require("./FlipContract.sol");
var ENS = artifacts.require("./ENS.sol");

module.exports = function(deployer) {
  deployer.deploy(GasReturnRelay);
  deployer.deploy(FlipContract);
  deployer.deploy(ENS);
};
