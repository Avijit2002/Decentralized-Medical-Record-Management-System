require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
      hardhat:{
        chainId: 31337,
        blockConfirmations:1
      },
      localhost: {
        url: "http://127.0.0.1:8545/",
        chainId: 31337,
      },
      // georlie....url,accounts
      // local
  },
  solidity: "0.8.18",
  namedAccounts:{
    deployer:{
      default: 0,
    },
    player:{
      default: 1
    }
  }
};
