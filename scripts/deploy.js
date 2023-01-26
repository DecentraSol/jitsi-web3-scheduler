const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

  // const provider = new ethers.providers.JsonRpcProvider(process.env.HTTP_URL);
  const blockNumber = await hre.ethers.provider.getBlockNumber()
  const network = await hre.ethers.provider.getNetwork()
  const account0 = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  const balance = await ethers.provider.getBalance(account0)
  console.log('blockNumber',blockNumber)
  console.log('network',network)
  console.log(`balance of address ${account0}`,ethers.utils.formatEther(balance))

  const Contract = await hre.ethers.getContractFactory("Calend3");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log("Calend3 contract deployed to:", contract.address);

  saveFrontendFiles();
}

function saveFrontendFiles() {
  const fs = require("fs");

  const abiDir = __dirname + "/../client/src/abis";

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  const artifact = artifacts.readArtifactSync("Calend3");

  fs.writeFileSync(abiDir + "/Calend3.json", JSON.stringify(artifact, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
