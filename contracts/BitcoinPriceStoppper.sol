pragma solidity ^0.4.4;


contract BitcoinPriceStoppper {
    uint public initialPrice;
    uint public createdAt;
    uint32 public clicks;
    address public lastClicker;

    event PriceClicked(address indexed sender);

    constructor(uint price) public {
        initialPrice = price;
        createdAt = now;
    }

    function click() public {
        clicks++;
        emit PriceClicked(msg.sender);
        lastClicker = msg.sender;
    }

    function getCalculation() public view returns (uint) {
        return initialPrice + (now - createdAt) / 1 days * 5 - clicks;
    }
}
