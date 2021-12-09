import { assert } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-extraneous-import
import { describe } from "mocha";
import { PickCell } from "../typechain";

let pickCell: PickCell;
describe("PickCell", function () {
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    const PickCell = await ethers.getContractFactory("PickCell");
    pickCell = await PickCell.deploy();
    await pickCell.deployed();
    console.log(`Deployed PickCell: ${pickCell.address}`);
  });
  it("It should have PickCell name", async function () {
    const name = await pickCell.name();
    assert.equal(name, "PickCell", "Contract doesn't have PickCell name");
  });
  it("It should have PXL symbol", async function () {
    const symbol = await pickCell.symbol();
    assert.equal(symbol, "PXL", "Contract doesn't have PXL symbol");
  });

  it("It should return nft in token URI", async function () {
    const tokenId = 1;
    const uri = await pickCell.tokenURI(tokenId);
    console.log("NFT URI", uri);
    const base64Json = uri.replace("-data:application/json;base64,", "");
    const nft = JSON.parse(Buffer.from(base64Json, "base64").toString());
    console.log("NFT", nft);

    const expectedSvg = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 7 8\" shape-rendering=\"crispEdges\"> <text x="10" y="10" class="a">Token #${tokenId}</text><rect fill=\"#0\" x=\"\" y=\"\" width=\"1\" height=\"1\" /></svg>`;
    const expectedDescription = "An amazing pick-cell nft !";
    const expectedName = "PickCell";
    assert.equal(
      nft.image_data,
      expectedSvg,
      "Contract doesn't generate valid svg"
    );
    assert.equal(
      nft.name,
      expectedName,
      "Contract doesn't generate valid name"
    );
    assert.equal(
      nft.description,
      expectedDescription,
      "Contract doesn't generate valid description"
    );
  });
});
