pragma solidity ^0.4.19;


contract ENS {
    mapping (bytes32 => address) public usersToIdentityAddress;


    function setUserIdentityAddress(string username, address identityAddress) public {
        require(usersToIdentityAddress[keccak256(username)] == address(0));

        usersToIdentityAddress[keccak256(username)] = identityAddress;
    }

    function getIdentityAddress(string username) public view returns (address){
        //        require(usersToIdentityAddress[username] != address(0));

        return usersToIdentityAddress[keccak256(username)];
    }
}
