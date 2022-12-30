const { ethers } = require("hardhat");
const hre = require("hardhat");

const main = async () => {
  console.log("DEPLOYING");
  const contractFactory = await hre.ethers.getContractFactory("Ex");
  const contract = await contractFactory.deploy(
    "ANNA",
    "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
    "GANNA",
    "0xd9145CCE52D386f254917e481eB44e9943F39138",
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE"
  );
  await contract.deployed();
  console.log("=== contract deployed to ", contract.address);
  console.log("ANNA" == (await contract.symb1()));
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
  /*
  const tx1 = await contract.addEx(
    "ANNA",
    "0xe145Ac17716770f178abcAcf68e633bbBab4cDaB",
    "GANNA",
    "0x484AC746C5a960E6F9440D956A45CBe7ce4d123a"
  );
  console.log(await contract.getEx("ANNA", "GANNA"));

  const signer = await hre.ethers.getSigner();
  const exchnageContract = await hre.ethers.getContractAt(
    "Ex",
    "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    signer
  );
  console.log("doing it now...");
  const a = await exchnageContract.getEst("ANNA", 100);
  console.log("res", a);*/
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
