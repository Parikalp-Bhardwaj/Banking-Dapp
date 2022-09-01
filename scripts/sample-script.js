const fs = require("fs")
const hre = require("hardhat");

async function main() {
 
  
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.deployed();
  
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(bank.address);
  await token.deployed();

  console.log("Token deployed to:", token.address);
  console.log("Bank deployed to:", bank.address);

  // let's create json file to smart contract addresses

  let addresses = {
    tokenAddress:token.address,
    bankAddress:bank.address
  }

  let addresJson = JSON.stringify(addresses)

  fs.writeFileSync("./client/src/artifacts/Addresses.json",addresJson)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
