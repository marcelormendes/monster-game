const MonsterGame = artifacts.require("MonsterGame");
const SLabs = artifacts.require("SLabs");
const LinkTokenInterface = artifacts.require("LinkTokenInterface");

/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || "5000000000000000000";

module.exports = async (callback) => {
  const mg = await MonsterGame.deployed();
  const linkTokenAddress = await mg.getChainlinkToken();
  const token = await LinkTokenInterface.at(linkTokenAddress);
  const tx = await token.transfer(mg.address, payment);
  callback(tx.tx);
};
