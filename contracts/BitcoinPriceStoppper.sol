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

        uint b=initialPrice + (now - createdAt) * 60 ;
        uint c=clicks * 1000;
        if(b>c){
        return b-c;
        }else{
        return 0;
        }
    }
}
