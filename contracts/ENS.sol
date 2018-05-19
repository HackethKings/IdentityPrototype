pragma solidity ^0.4.19;


contract ENS {
    mapping (bytes32 => address) public usersToIdentityAddress;

    // The addresses of the accounts (or contracts) that can execute actions within each roles.
    address public relayAddress;

    modifier onlyRelay() {
        require(msg.sender == relayAddress);
        _;
    }

    function setUserIdentityAddress(string username, address identityAddress) public {
        bytes32 hashedUsername = keccak256(username);
        //require(usersToIdentityAddress[hashedUsername] == address(0));

        usersToIdentityAddress[hashedUsername] = identityAddress;
    }

    function getIdentityAddress(string username) public view returns(address) {
        //        require(usersToIdentityAddress[username] != address(0));

        return usersToIdentityAddress[keccak256(username)];
    }
}
