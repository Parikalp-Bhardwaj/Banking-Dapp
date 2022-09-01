//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Token is ERC20{
    address private bankContract;

    modifier onlyBank(){
        require(msg.sender == bankContract,"Only the bank can mint new Tokens");
    _;
    }

    constructor(address _bankAddress) ERC20("Token","Sample"){
        bankContract = _bankAddress;
    }

    function mint(address to,uint256 amount)public onlyBank{
        _mint(to,amount);
    }

}