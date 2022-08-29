const LinkToken = artifacts.require("LinkToken");
const MonsterGame = artifacts.require("MonsterGame");
const Slabs = artifacts.require("SLabs");
const VRFCoordinatorMock = artifacts.require("VRFCoordinatorMock");
const LabMonster = artifacts.require("LabMonster");

module.exports = async (callback) => {
  // run only without frontend
  // const linkToken = await LinkToken.deployed();
  // const slabs = await Slabs.deployed();
  // await linkToken.transfer(mg.address, web3.utils.toWei("1", "ether"));
  // await slabs.approve(mg.address, web3.utils.toWei("15", "ether"));

  const mg = await MonsterGame.deployed();
  const vrfCoordinatorMock = await VRFCoordinatorMock.deployed();

  // run only without frontend
  // const transaction = await mg.requestNewMonster();
  // const { requestId } = transaction.logs[0].args;

  const tx = await vrfCoordinatorMock.callBackWithRandomness(
    process.argv[4],
    process.argv[5],
    mg.address
  );

  callback(tx.tx);
};
