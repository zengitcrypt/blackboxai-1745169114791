require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Get environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const BSC_TESTNET_URL = process.env.BSC_TESTNET_URL || "https://data-seed-prebsc-1-s1.binance.org:8545";
const BSC_MAINNET_URL = process.env.BSC_MAINNET_URL || "https://bsc-dataseed.binance.org/";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bscTestnet: {
      url: BSC_TESTNET_URL,
      chainId: 97,
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000 // 20 gwei
    },
    bscMainnet: {
      url: BSC_MAINNET_URL,
      chainId: 56,
      accounts: [PRIVATE_KEY],
      gasPrice: 5000000000 // 5 gwei
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
