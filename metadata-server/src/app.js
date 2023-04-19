import express from "express";
import router from "./routes/metadata.js";
import { app as appConfig, blockChainConfig, dbConfig } from "./config";
import mongoose from "mongoose";
import { Metadata } from "./repositories/metadata";
import MonsterGame from "../../build/contracts/MonsterGame.json" assert { type: "json" };
import LabMonster from "../../build/contracts/LabMonster.json" assert { type: "json" };
import { ethers } from "ethers";
import { metadataService } from "./services/metadata";
import fs from "fs";

// HTTP
const app = express();
app.locals.name = appConfig.name;
app.locals.version = appConfig.version;
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

try {
  console.log("db connect name", dbConfig.db_name);
  await mongoose.connect(`mongodb://localhost:27017/monster`, {
    authSource: "admin",
    user: dbConfig.db_username,
    pass: dbConfig.db_password,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (e) {
  console.log(e);
}

app.listen(appConfig.port, () => {
  console.log(`Server Running in http://${appConfig.host}:${appConfig.port}`);
});

process.on("SIGINT", () => {
  console.log("exiting…");
  process.exit();
});

process.on("exit", () => {
  console.log("exiting…");
  process.exit();
});

const mnemonic = fs.readFileSync("../.secret").toString().trim();

const provider = new ethers.providers.JsonRpcProvider(
  blockChainConfig.network_url
);
const signer = provider.getSigner();

const mgAddress = MonsterGame.networks[blockChainConfig.network_id].address;
const labMonsterAddress =
  LabMonster.networks[blockChainConfig.network_id].address;

const wallet = new ethers.Wallet.fromMnemonic(mnemonic);
const walletWithProvider = wallet.connect(provider);

// get the smart contract
const labMonsterContract = new ethers.Contract(
  labMonsterAddress,
  LabMonster.abi,
  walletWithProvider
);

const mgContract = new ethers.Contract(mgAddress, MonsterGame.abi, signer);

mgContract.on("MonsterCreated", async (monster, tokenId, _owner, event) => {
  console.log("event block number", event.blockNumber);

  const metadata = await Metadata.find({});
  const blockNumber = metadata[0].blockNumber;

  if (event.blockNumber <= blockNumber) return;

  console.log("going to create metadata");
  try {
    metadataService(
      monster.power.toNumber(),
      tokenId.toNumber(),
      monster.monsterTypeId.toNumber(),
      event.blockNumber,
      labMonsterContract,
      metadata[0].id,
      mgAddress
    );
  } catch (e) {
    console.log("Service Error", e);
  }
});

export default app;
