pragma solidity ^0.4.21;

contract FlipContract {

    bool public flipped = false;

    function flip() public {
        flipped = true;
    }
}