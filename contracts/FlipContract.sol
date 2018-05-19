pragma solidity ^0.4.21;

contract FlipContract {

    bool public flipped = false;

    uint public counter = 5;

    function flip() public {
        flipped = true;
    }

    function add() public {
        counter++;
    }

    function time() public returns (uint) {
        return now;
    }
}