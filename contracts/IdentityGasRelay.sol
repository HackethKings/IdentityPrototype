pragma solidity ^0.4.21;

/**
 * @title IdentityGasRelay
 * @author Ricardo Guilherme Schmidt (Status Research & Development GmbH)
 * @notice enables economic abstraction for Identity
 */
contract IdentityGasRelay {

    bytes4 public constant CALL_PREFIX = bytes4(keccak256("callGasRelay(address,uint256,bytes32,uint256,uint256,address)"));
    bytes4 public constant APPROVEANDCALL_PREFIX = bytes4(keccak256("approveAndCallGasRelay(address,address,uint256,bytes32,uint256,uint256)"));
    mapping (bytes32 => Key) keys;
    uint256 constant ACTION_KEY = 2;

    struct Key {
        uint256 purpose; //e.g., MANAGEMENT_KEY = 1, ACTION_KEY = 2, etc.
        uint256 keyType; // e.g. 1 = ECDSA, 2 = RSA, etc.
        bytes32 key;
    }

    event ExecutedGasRelayed(bytes32 signHash, bool success);

    address public owner;

    string public name;

    function setOwner(address newOwner) public {
        owner = newOwner;
    }

    function setName(string newName) public {
        name = newName;
    }
    /**
     * @notice include ethereum signed callHash in return of gas proportional amount multiplied by `_gasPrice` of `_gasToken`
     *         allows identity of being controlled without requiring ether in key balace
     * @param _to destination of call
     * @param _value call value (ether)
     * @param _data call data
     * @param _gasPrice price in SNT paid back to msg.sender for each gas unit used
     * @param _gasLimit minimal gasLimit required to execute this call
     * @param _messageSignatures rsv concatenated ethereum signed message signatures required
     */
    function callGasRelayed(
        address _to,
        uint256 _value,
        bytes _data,
        uint _gasPrice,
        uint _gasLimit,
        address _gasToken,
        bytes _messageSignatures
    )
        external
    {
        uint startGas = gasleft();
        //verify transaction parameters
        //require(startGas >= _gasLimit);
        //require(_nonce == nonce);
        // calculates signHash
        bytes32 signHash = getSignHash(
            callGasRelayHash(
                _to,
                _value,
                keccak256(_data),
                _gasPrice,
                _gasLimit
            )
        );

        //verify if signatures are valid and came from correct actors;
        verifySignatures(
            ACTION_KEY,
            signHash,
            _messageSignatures
        );

        //executes transaction
        bool success = _to.call.value(_value)(_data);
        emit ExecutedGasRelayed(
            signHash,
            success
        );

        //refund gas used using contract held ERC20 tokens or ETH
        if (_gasPrice > 0) {
            uint256 _amount = 21000 + (startGas - gasleft());
            _amount = _amount * _gasPrice;
            if (_gasToken == address(0)) {
                address(msg.sender).transfer(_amount);
            }
        }
    }

    /**
     * @notice reverts if signatures are not valid for the signed hash and required key type.
     * @param _requiredKey key required to call, if _to from payload is the identity itself, is `MANAGEMENT_KEY`, else `ACTION_KEY`
     * @param _signHash ethereum signable callGasRelayHash message provided for the payload
     * @param _messageSignatures ethereum signed `_signHash` messages
     * @return true case valid
     */
    function verifySignatures(
        uint256 _requiredKey,
        bytes32 _signHash,
        bytes _messageSignatures
    )
        public
        view
        returns(bool)
    {
        uint _amountSignatures = _messageSignatures.length / 72;
        bytes32 _lastKey = 0;
        for (uint256 i = 0; i < _amountSignatures; i++) {
            bytes32 _currentKey = recoverKey(
                _signHash,
                _messageSignatures,
                i
                );
            require(_currentKey > _lastKey); //assert keys are different
            require(isKeyPurpose(_currentKey, _requiredKey));
            _lastKey = _currentKey;
        }
        return true;
    }

    function isKeyPurpose(bytes32 _key, uint256 _purpose)
        public
        view
        returns (bool)
    {
        return keys[keccak256(_key, _purpose)].purpose == _purpose;
    }

    /**
     * @notice get callHash
     * @param _to destination of call
     * @param _value call value (ether)
     * @param _dataHash call data hash
     * @param _gasPrice price in SNT paid back to msg.sender for each gas unit used
     * @param _gasLimit minimal gasLimit required to execute this call
     * @return callGasRelayHash the hash to be signed by wallet
     */
    function callGasRelayHash(
        address _to,
        uint256 _value,
        bytes32 _dataHash,
        uint256 _gasPrice,
        uint256 _gasLimit
    )
        public
        view
        returns (bytes32 _callGasRelayHash)
    {
        _callGasRelayHash = keccak256(
            address(this),
            CALL_PREFIX,
            _to,
            _value,
            _dataHash,
            _gasPrice,
            _gasLimit
        );
    }

    /**
     * @notice Hash a hash with `"\x19Ethereum Signed Message:\n32"`
     * @param _hash Sign to hash.
     * @return signHash Hash ethereum wallet signs.
     */
    function getSignHash(
        bytes32 _hash
    )
        pure
        public
        returns(bytes32 signHash)
    {
        signHash = keccak256("\x19Ethereum Signed Message:\n32", _hash);
    }

    /**
     * @notice recovers address who signed the message
     * @param _signHash operation ethereum signed message hash
     * @param _messageSignature message `_signHash` signature
     * @param _pos which signature to read
     */
    function recoverKey (
        bytes32 _signHash,
        bytes _messageSignature,
        uint256 _pos
    )
        pure
        public
        returns(bytes32)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v,r,s) = signatureSplit(_messageSignature, _pos);
        return bytes32(
            ecrecover(
                _signHash,
                v,
                r,
                s
            )
        );
    }

    /**
     * @dev divides bytes signature into `uint8 v, bytes32 r, bytes32 s`
     * @param _pos which signature to read
     * @param _signatures concatenated vrs signatures
     */
    function signatureSplit(bytes _signatures, uint256 _pos)
        pure
        public
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        uint pos = _pos + 1;
        // The signature format is a compact form of:
        //   {bytes32 r}{bytes32 s}{uint8 v}
        // Compact means, uint8 is not padded to 32 bytes.
        assembly {
            r := mload(add(_signatures, mul(32,pos)))
            s := mload(add(_signatures, mul(64,pos)))
            // Here we are loading the last 32 bytes, including 31 bytes
            // of 's'. There is no 'mload8' to do this.
            //
            // 'byte' is not working due to the Solidity parser, so lets
            // use the second best option, 'and'
            v := and(mload(add(_signatures, mul(65,pos))), 0xff)
        }

        require(v == 27 || v == 28);
    }


}
