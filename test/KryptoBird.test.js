const { assert, expect } = require("chai");

const kryptoBird = artifacts.require("./KryptoBirdz");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("KryptoBirdz", async (accounts) => {
  let kryptoContract;
  const list = ["https...1", "https...2", "https...3", "https...4"];

  before(async () => {
    kryptoContract = await kryptoBird.deployed();
  });
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = kryptoContract.address;
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has name", async () => {
      const name = await kryptoContract.name();
      assert.equal(name, "KryptoBirdz");
    });
    it("has symbol", async () => {
      const symbol = await kryptoContract.symbol();
      assert.equal(symbol, "KBIRZ");
    });
  });

  describe("minting", async () => {
    it("creates a new token", async () => {
      const result = await kryptoContract.mint(list[0]);
      const totalSupply = await kryptoContract.totalSupply();
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event._from, "0x0000000000000000000000000000000000000000");
      assert.equal(event._to, accounts[0]);
    });
  });

  describe("indexing", async () => {
    it("list of cryptobirdz", async () => {
      await kryptoContract.mint(list[1]);
      await kryptoContract.mint(list[2]);
      await kryptoContract.mint(list[3]);

      const totalSupply = await kryptoContract.totalSupply();

      const result = [];

      for (let i = 0; i < totalSupply; i++) {
        const kryptoBird = await kryptoContract.kryptoBirdz(i);
        result.push(kryptoBird);
      }

      assert.equal(result.join(","), list.join(","));
    });
  });
});
