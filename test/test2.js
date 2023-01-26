const { ethers, upgrades } = require("hardhat");
const abi = require("../build/Calend3.json")
/**
 *  npx hardhat run --network local scripts/deploy.js
 *  npx hardhat test --network local test/test2.js
 *  npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/26h3i23UhYjW8MIoFMUVtavLvC-IipFZ
 */
describe("JitsiWeb3Scheduler", function () {

  const contractAddress = "0x25C0a2F0A077F537Bd11897F04946794c2f6f1Ef"
  const contractABI = abi.abi;
  let contract 

  beforeEach(async function () {
    const provider = waffle.provider;
    contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider.getSigner()
    );

  })  

  it("Should print owner of contract", async function () {
    const owner = await contract.owner()
    console.log("owner",owner)
})
})