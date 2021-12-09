// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs-extra";

async function updateContractAddressForReact(address: string) {
  const reactEnvFile = "./app/.env";
  const reactEnv = (await fs.readFile(reactEnvFile)).toString();
  const regex = /(REACT_APP_PICKCELL_ADDRESS=)".*"/;
  const editedEnv = reactEnv.replace(regex, `$1"${address}"`);
  await fs.writeFile(reactEnvFile, editedEnv);
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Migrations = await ethers.getContractFactory("Migrations");
  // const migrations = await Migrations.deploy();

  const PickCell = await ethers.getContractFactory("PickCell");
  const pickCell = await PickCell.deploy();

  await pickCell.deployed();
  console.log("PickCell deployed to:", pickCell.address);
  await updateContractAddressForReact(pickCell.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
