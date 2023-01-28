const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

const abi = require("../build/Calend3.json")
/**
 *  npx hardhat run --network local scripts/deploy.js
 *  npx hardhat test --network local test/test2.js
 *  npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/26h3i23UhYjW8MIoFMUVtavLvC-IipFZ
 */
describe("JitsiWeb3Scheduler", function () {

  const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
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
    [owner, addr1, addr2] = await ethers.getSigners();
    expect(await contract.owner()).to.equal(owner.address);
})
})