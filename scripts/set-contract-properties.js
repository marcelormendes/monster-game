const MonsterGame = artifacts.require("MonsterGame");

module.exports = async (callback) => {
  const mg = await MonsterGame.deployed();

  const tx = await mg.updateMintPrice(
    web3.utils.toWei(process.argv[4], "ether")
  );
  const tx2 = await mg.updateMonsterTotal(process.argv[5]);

  callback(tx.tx);
};
