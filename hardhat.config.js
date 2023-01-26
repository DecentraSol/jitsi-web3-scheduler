require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: { 
      //url: "http://127.0.0.1:8545/",
      chainId: 1337,
      initialBaseFeePerGas: 0,
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
//        blockNumber: 12158458 
      },
      timeout: 100000
    },
    mumbai: {
      url: process.env.HTTP_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  }
};
