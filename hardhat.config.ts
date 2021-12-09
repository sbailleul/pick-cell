import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import fs from "fs-extra";

dotenv.config();
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

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    ropsten: {
      url:
        process.env.ROPSTEN_URL ||
        "https://ropsten.infura.io/v3/b9767258f67a465ba2b1b570e3640dfc",
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY]
          : [
            "05eb5c9948e014488526ee1c08cf09f59f702d221ed5841226f8af370be4d923"
          ]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
const DAPP_ARTIFACTS_DIRECTORY = "./app/src/typechain";
const COMPILE_COPY_ARTIFACTS_TASK = "compile-copy";
task(
  COMPILE_COPY_ARTIFACTS_TASK,
  "Compiles the entire project, building all artifacts andcopy contracts"
)
  .addFlag("force", "Force compilation ignoring cache")
  .addFlag("quiet", "Makes the compilation process less verbose")
  .setAction(async (compilationArgs: any, { run, config }) => {
    await run("compile", compilationArgs);
    const srcDirectory = `${config.typechain.outDir}`;
    console.info(`Copying artifacts from ${srcDirectory} to ${DAPP_ARTIFACTS_DIRECTORY} `);
    await fs.copy(srcDirectory, DAPP_ARTIFACTS_DIRECTORY);

  });
export default config;
