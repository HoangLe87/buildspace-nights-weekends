const { ethers } = require("hardhat");
const hre = require("hardhat");

const main = async () => {
  console.log("DEPLOYING");
  const contractFactory = await hre.ethers.getContractFactory("Anna");
  const contract = await contractFactory.deploy(
    "0xd9145CCE52D386f254917e481eB44e9943F39138"
  );
  await contract.deployed();
  console.log("=== contract deployed to ", contract.address);
  /*

  const contractAdr = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const contractName = "ExFac";
  const signer = await hre.ethers.getSigner();
  const contract = await hre.ethers.getContractAt(
    contractAdr,
    contractName,
    signer
  );
  */
  console.log("BUYING 1 ANNA");
  const tx1 = await contract.buyAnna("1", {
    value: ethers.utils.parseEther(String(0.1)),
  });

  /*
  const signer = await hre.ethers.getSigner();
  const exchnageContract = await hre.ethers.getContractAt(
    "Ex",
    "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    signer
  );
  */
  console.log("DONE 1 ANNA");
  console.log("=== FINISH ===");
};

const runMain = (async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
