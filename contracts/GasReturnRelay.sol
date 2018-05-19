pragma solidity ^0.4.23;


contract GasReturnRelay {
    event ExecutedGasRelayed(bool success);

    address public owner;

    string public name;

    function setOwner(address newOwner) public {
        owner = newOwner;
    }

    function setName(string newName) public {
        name = newName;
    }

    function() public payable {
    }


    /**
     * @notice include ethereum signed callHash in return of gas proportional amount multiplied by `_gasPrice` of `_gasToken`
     *         allows identity of being controlled without requiring ether in key balace
     * @param _to destination of call
     * @param _value call value (ether)
     * @param _data call data
     * @param _gasPrice price in SNT paid back to msg.sender for each gas unit used
     * @param _gasLimit minimal gasLimit required to execute this call
     */
    function callGasRelayed(
    address _to,
    uint256 _value,
    bytes _data,
    uint _gasPrice,
    uint _gasLimit
    )
    external
    {
        uint startGas = gasleft();
        //verify transaction parameters
        require(startGas >= _gasLimit);


        //executes transaction
        bool success = _to.call.value(_value)(_data);
        emit ExecutedGasRelayed(success);

        //refund gas used using contract held ERC20 tokens or ETH
        if (_gasPrice > 0) {
            uint256 _amount = 21000 + (startGas - gasleft());
            _amount = _amount * _gasPrice;
            address(msg.sender).transfer(_amount);
        }
    }
}
