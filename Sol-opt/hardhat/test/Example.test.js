const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Example contract gas benchmark", function () {
  let example;

  beforeEach(async function () {
    const Example = await ethers.getContractFactory("Example");
    example = await Example.deploy();  // deploy returns deployed instance, no need for .deployed()
    // await example.deployed(); // REMOVE or comment out this line
  });

  it("addData gas cost", async function () {
    const tx = await example.addData(42);
    const receipt = await tx.wait();
    console.log("Gas used by addData:", receipt.gasUsed.toString());
  });

  it("wasteGas gas cost", async function () {
    const tx = await example.wasteGas();
    const receipt = await tx.wait();
    console.log("Gas used by wasteGas:", receipt.gasUsed.toString());
  });
});
