var ClaimHolder = artifacts.require("./ClaimHolder.sol");

module.exports = function(deployer) {
  deployer.deploy(ClaimHolder);
};
