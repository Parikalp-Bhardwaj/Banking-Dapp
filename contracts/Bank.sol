//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "./Token.sol";

contract Bank{
    mapping(address=>uint) public accounts;

    function totalAmount()public view returns(uint){
        return address(this).balance;
    }

    function deposit()external payable{
        require(msg.value > 0,"Must deposit more than 0 ether");
        accounts[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount,address _tokenContract)external{
        require(_amount <= accounts[msg.sender],"Insufficient balance");
        accounts[msg.sender] -= _amount;
        (bool success,)=payable(msg.sender).call{value:_amount}("");
        require(success,"call failed");
        Token yieldToken = Token(_tokenContract);
        yieldToken.mint(msg.sender,1 ether);
    }
}