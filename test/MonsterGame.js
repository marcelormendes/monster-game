const LinkToken = artifacts.require("LinkToken");
const MonsterGame = artifacts.require("MonsterGame");
const LabMonster = artifacts.require("LabMonster");
const SLabs = artifacts.require("SLabs");
const VRFCoordinatorMock = artifacts.require("VRFCoordinatorMock");
const { expectRevert } = require("@openzeppelin/test-helpers");

let slabs, mg, linkToken, vrfCoordinatorMock, labMonster;

contract("MonsterGame", (accounts) => {
  const defaultAccount = accounts[0];

  before(async () => {
    slabs = await SLabs.deployed();
    mg = await MonsterGame.deployed();
    vrfCoordinatorMock = await VRFCoordinatorMock.deployed();
    linkToken = await LinkToken.deployed();
    labMonster = await LabMonster.deployed();
  });

  describe("RequestMonster", () => {
    it.only("request a new monster and get a token id", async () => {
      await linkToken.transfer(mg.address, web3.utils.toWei("1", "ether"), {
        from: defaultAccount,
      });
      await slabs.approve(mg.address, web3.utils.toWei("15", "ether"), {
        from: defaultAccount,
      });

      await labMonster.updateGameTokenAddrress(mg.address);

      const transaction = await mg.requestNewMonster({ from: defaultAccount });
      const { requestId } = transaction.logs[0].args;
      await vrfCoordinatorMock.callBackWithRandomness(
        requestId,
        15,
        mg.address,
        { from: defaultAccount }
      );

      const monsters = await mg.getMonsters(defaultAccount);
      const monstersArray = [];
      for (let monster of monsters) {
        const idToMonster = await mg.idToMonster(monster.toNumber(), {
          from: defaultAccount,
        });
        monstersArray.push({
          power: idToMonster.power.toNumber(),
          monsterTypeId: idToMonster.monsterTypeId.toNumber(),
        });
      }
      const power = monstersArray[0].test;
      const monsterTypeId = monstersArray[0].monsterTypeId;
      assert.equal(power, 37);
      assert.equal(monsterTypeId, 4);
    });

    it("request a new monster, but get insufficient LINK and revert", async () => {
      await expectRevert(
        mg.requestNewMonster({ from: defaultAccount }),
        "Not enough LINK - fill the contract"
      );
    });

    it("request a new monster, but get insufficient allowance and revert", async () => {
      await linkToken.transfer(mg.address, web3.utils.toWei("1", "ether"), {
        from: defaultAccount,
      });
      await expectRevert(
        mg.requestNewMonster({ from: defaultAccount }),
        "ERC20: insufficient allowance"
      );
    });
  });
});
