pragma solidity ^0.4.22;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/IdentityRegistration.sol";

contract TestIdentityRegistration {

    function testInitialMappingUsingDeployedContract() public {
        IdentityRegistration registration = IdentityRegistration(DeployedAddresses.IdentityRegistration());

        address expected = address(0);

        Assert.equal(registration.getIdentityAddress("blablabla"), expected, "User blablabla should be not registered initially");
    }
}