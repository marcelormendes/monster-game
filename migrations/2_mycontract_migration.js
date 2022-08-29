const LinkToken = artifacts.require("LinkToken");
const MonsterGame = artifacts.require("MonsterGame");
const Slabs = artifacts.require("SLabs");
const VRFCoordinatorMock = artifacts.require("VRFCoordinatorMock");
const LabMonster = artifacts.require("LabMonster");
const MUMBAI_LINKTOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const MUMBAI_VRF_COORDINATOR = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
const MUMBAI_KEYHASH =
  "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";

module.exports = async (deployer, network, [defaultAccount]) => {
  if (network.startsWith("development")) {
    LinkToken.setProvider(deployer.provider);
    VRFCoordinatorMock.setProvider(deployer.provider);
    try {
      await deployer.deploy(LinkToken, { from: defaultAccount });
      await deployer.deploy(VRFCoordinatorMock, LinkToken.address, {
        from: defaultAccount,
      });
      await deployer.deploy(Slabs, web3.utils.toWei("1000000", "ether"));
      await deployer.deploy(LabMonster);
      await deployer.deploy(
        MonsterGame,
        LabMonster.address,
        Slabs.address,
        VRFCoordinatorMock.address,
        LinkToken.address,
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
        web3.utils.toWei("0.0001", "ether")
      );

      const labMonster = await LabMonster.deployed();
      await labMonster.updateGameTokenAddrress(MonsterGame.address);
    } catch (err) {
      console.error(err);
    }
  } else {
    await deployer.deploy(Slabs, web3.utils.toWei("1000000000", "ether"));
    await deployer.deploy(LabMonster);
    await deployer.deploy(
      MonsterGame,
      LabMonster.address,
      Slabs.address,
      MUMBAI_VRF_COORDINATOR,
      MUMBAI_LINKTOKEN,
      MUMBAI_KEYHASH,
      web3.utils.toWei("0.0001", "ether")
    );

    const labMonster = await LabMonster.deployed();
    await labMonster.updateGameTokenAddrress(MonsterGame.address);
  }
};
