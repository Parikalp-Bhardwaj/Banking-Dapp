const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", ()=> {
  let bank,token,tokenAdd,ownerAdd,add1,add2,allAdd;
  beforeEach(async()=>{
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.deployed()

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(bank.address);
    await token.deployed();

    [owner,Add,add1,add2,...allAdd] = await ethers.getSigners()
  })
  describe("Development ",()=>{
    it("should have totalAssets 0",async()=>{
      expect(await bank.totalAmount()).to.equal(0)
      
    })
    it("token should have name and symbol",async()=>{
      expect(await token.name()).to.equal('Token')
      expect(await token.symbol()).to.equal('Sample')
      
    })
    it("should have 0 token and 0 deposite",async()=>{
      expect(await bank.accounts(owner.address)).to.equal(0)
      expect(await token.balanceOf(add1.address)).to.equal(0)
      
    })

    describe("Deposit and withdrawal",()=>{
      const oneEth = ethers.utils.parseEther("1.0")
      it("should let owner deposit the amount of ether",async()=>{
        await bank.connect(owner).deposit({value:oneEth});
        expect(await bank.totalAmount()).to.equal(oneEth)
        expect(await bank.accounts(owner.address)).to.equal(oneEth)
      })
      it("should let account 1 despoite and withdraw 1 Unit, then have 1 unit of free token",async()=>{
        await bank.connect(add1).deposit({value:oneEth});
        await bank.connect(add1).withdraw(oneEth,token.address);
        expect(await bank.totalAmount()).to.equal("0");
        expect(await token.balanceOf(add1.address)).to.equal(oneEth);
      });
      it("should fall when trying to withdraw money one hasn't deposited",async()=>{
        await expect(
          bank.connect(add2).withdraw(oneEth,token.address)
          ).to.be.revertedWith("Insufficient balance")
      })
    })


  })
});
