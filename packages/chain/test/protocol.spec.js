import { describe, it } from "node:test";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseEther } from "viem";

process.on("unhandledRejection", (err) => {
  console.error("UnhandledRejection", err);
});
process.on("uncaughtException", (err) => {
  console.error("UncaughtException", err);
});

describe("Web3 University Protocol", () => {
  async function deployAll() {
    const { viem } = await hre.network.connect();
    const [admin, author, learner] = await viem.getWalletClients();

    const token = await viem.deployContract("YIDENGToken", [
      "YIDENG",
      "YDG",
      1_000_000n * 10n ** 18n,
    ]);
    const nft = await viem.deployContract("CourseNFT", ["Course Access", "COURSE"]);
    const courseMgr = await viem.deployContract("CourseManager", [token.address, nft.address]);
    const rewardPool = await viem.deployContract("RewardPool", [token.address]);
    const weth = await viem.deployContract("MockWETH");
    const aavePool = await viem.deployContract("MockAavePool");
    const adapter = await viem.deployContract("AAVEAdapter", [aavePool.address, weth.address]);

    // Grant required roles
    await nft.write.grantRole([await nft.read.MINTER_ROLE(), courseMgr.address]);
    await token.write.grantRole([await token.read.REWARD_DISTRIBUTOR_ROLE(), rewardPool.address]);
    await token.write.grantRole([await token.read.REWARD_DISTRIBUTOR_ROLE(), admin.account.address]);
    await token.write.grantRole([await token.read.MINTER_ROLE(), admin.account.address]);
    await courseMgr.write.grantRole(
      [await courseMgr.read.COURSE_CREATOR_ROLE(), author.account.address],
      { account: admin.account }
    );

    return { viem, admin, author, learner, token, nft, courseMgr, rewardPool, adapter, weth, aavePool };
  }

  async function expectRevert(promise, message) {
    let failed = false;
    try {
      await promise;
    } catch (err) {
      failed = true;
      expect(String(err?.message || err)).to.include(message);
    }
    if (!failed) {
      throw new Error("Expected revert but succeeded");
    }
  }

  describe("YIDENGToken", () => {
    it("mints within cap and burns correctly", async () => {
      const { token, learner } = await deployAll();
      await token.write.mint([learner.account.address, 100n]);
      expect(await token.read.totalSupply()).to.equal(100n);
      await token.write.burn([50n], { account: learner.account });
      expect(await token.read.balanceOf([learner.account.address])).to.equal(50n);
    });

    it("enforces cap", async () => {
      const { token } = await deployAll();
      const cap = await token.read.cap();
      await expectRevert(
        token.write.mint([
          getAddress("0x0000000000000000000000000000000000000001"),
          cap + 1n,
        ]),
        "cap exceeded"
      );
    });
  });

  describe("CourseManager + CourseNFT", () => {
    it("creates, buys, mints SBT and withdraws", async () => {
      const { courseMgr, nft, token, author, learner } = await deployAll();

      // fund learner with token and approve manager
      await token.write.mint([learner.account.address, 1_000n]);
      await token.write.approve([courseMgr.address, 1_000n], { account: learner.account });

      await courseMgr.write.createCourse([100n], { account: author.account });
      const courseId = 1n;

      await courseMgr.write.buyCourse([courseId], { account: learner.account, value: 0n });
      expect(await nft.read.balanceOf([learner.account.address])).to.equal(1n);
      expect(await courseMgr.read.courseBalances([courseId])).to.equal(100n);

      await courseMgr.write.withdraw([courseId], { account: author.account });
      expect(await token.read.balanceOf([author.account.address])).to.equal(100n);
    });

    it("rejects duplicate purchases", async () => {
      const { courseMgr, token, author, learner } = await deployAll();
      await token.write.mint([learner.account.address, 200n]);
      await token.write.approve([courseMgr.address, 200n], { account: learner.account });
      await courseMgr.write.createCourse([100n], { account: author.account });
      const courseId = 1n;
      await courseMgr.write.buyCourse([courseId], { account: learner.account });
      await expectRevert(
        courseMgr.write.buyCourse([courseId], { account: learner.account }),
        "already purchased"
      );
    });
  });

  describe("RewardPool", () => {
    it("mints rewards and tracks totals", async () => {
      const { rewardPool, token, learner } = await deployAll();
      await rewardPool.write.rewardUser([learner.account.address, 50n]);
      expect(await token.read.balanceOf([learner.account.address])).to.equal(50n);
      expect(await rewardPool.read.rewarded([learner.account.address])).to.equal(50n);
    });
  });

  describe("AAVEAdapter", () => {
    it("supplies and withdraws ETH via WETH/Aave pool", async () => {
      const { adapter, weth, aavePool, author, viem } = await deployAll();

      // supply 1 ETH on behalf of author (operator is admin/deployer)
      await adapter.write.supplyETH([author.account.address], { value: parseEther("1") });
      const [supplied] = await adapter.read.positions([author.account.address, weth.address]);
      expect(supplied).to.equal(parseEther("1"));
      expect(await aavePool.read.supplied([adapter.address, weth.address])).to.equal(parseEther("1"));

      await adapter.write.withdraw([weth.address, parseEther("0.4")], { account: author.account });

      const [suppliedAfter] = await adapter.read.positions([author.account.address, weth.address]);
      expect(suppliedAfter).to.equal(parseEther("0.6"));
    });

    it("supplies ERC20 tokens", async () => {
      const { adapter, token, aavePool, author } = await deployAll();
      await token.write.mint([author.account.address, 500n]);
      await token.write.approve([adapter.address, 500n], { account: author.account });
      await adapter.write.supplyERC20([author.account.address, token.address, 300n]);
      const [supplied] = await adapter.read.positions([author.account.address, token.address]);
      expect(supplied).to.equal(300n);
      expect(await aavePool.read.supplied([adapter.address, token.address])).to.equal(300n);
    });
  });
});
