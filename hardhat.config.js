require("@nomiclabs/hardhat-waffle");

// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths:{
    artifacts:"./client/src/artifacts",
  },
};
