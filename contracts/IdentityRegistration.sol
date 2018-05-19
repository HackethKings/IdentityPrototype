pragma solidity ^0.4.22;

contract IdentityRegistration {

    event IdentityRegistered(address account, string name);

    mapping (uint => address) public idToAddress;

        function registerIdentity(string name) external returns (bool) {
        uint _id = uint(keccak256(name));
        if(_isIdentityAvailable(_id)) {
            _addIdentityToMap(_id);
            emit IdentityRegistered(msg.sender, name);
            return true;
        }
        return false;
    }

    function getIdentityAddress(string name) external view returns (address) {
        uint _id = uint(keccak256(name));
        return idToAddress[_id];
    }

    function _isIdentityAvailable(uint _id) internal view returns (bool) {
        return idToAddress[_id] == address(0);
    }

    function _addIdentityToMap(uint _id) internal {
        idToAddress[_id] = msg.sender;
    }
}
