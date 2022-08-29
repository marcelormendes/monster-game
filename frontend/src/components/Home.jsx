import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MonsterGame from "../../../build/contracts/MonsterGame.json";
import LabMonster from "../../../build/contracts/LabMonster.json";
import SLabs from "../../../build/contracts/SLabs.json";
import NFTImage from "./NFTImage";
import Loader from "./Loader";

const provider = new ethers.providers.Web3Provider(window.ethereum);

await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

const mgAddress = MonsterGame.networks[window.ethereum.networkVersion].address;
const lmAddress = LabMonster.networks[window.ethereum.networkVersion].address;
const slabsAddress = SLabs.networks[window.ethereum.networkVersion].address;

// get the smart contract
const mgContract = new ethers.Contract(mgAddress, MonsterGame.abi, signer);
const slabsContract = new ethers.Contract(slabsAddress, SLabs.abi, signer);
const lmContract = new ethers.Contract(lmAddress, LabMonster.abi, signer);

const mintPrice = ethers.utils.formatEther(await mgContract.getMintPrice());
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [monsterArray, setMonsterArray] = useState([]);

  useEffect(() => {
    const getMonsters = async () => {
      const monsters = await mgContract.getMonsters(
        window.ethereum.selectedAddress
      );
      const monstersFinal = [];
      for (let monsterId of monsters) {
        const idToMonster = await mgContract.idToMonster(monsterId.toNumber());
        monstersFinal.push({
          tokenId: monsterId.toNumber(),
          power: idToMonster.power.toNumber(),
          monsterTypeId: idToMonster.monsterTypeId.toNumber(),
        });
      }
      setMonsterArray(monstersFinal);
    };
    getMonsters();

    mgContract.on("RequestedMonster", (requestId, _owner, _event) => {
      console.log("monster requested: ", requestId);
    });

    mgContract.on("MonsterCreated", (_monster, _tokenId, _owner, _event) => {
      const tokenId = _tokenId.toNumber();
      const power = _monster.power.toNumber();
      const monsterTypeId = _monster.monsterTypeId.toNumber();

      if (
        _owner.toLowerCase() === window.ethereum.selectedAddress.toLowerCase()
      ) {
        const isMonsterAlreadyMinted = monsterArray.some(
          (monster) => monster.tokenId === tokenId
        );

        if (!isMonsterAlreadyMinted) {
          const newMonster = {
            tokenId,
            power,
            monsterTypeId,
          };

          setMonsterArray((monsterArray) => [...monsterArray, newMonster]);
          setIsLoading(false);
        }
      }
    });
  }, []);

  const mintToken = async () => {
    setIsLoading(true);

    const slabsAllowance = await slabsContract.allowance(
      window.ethereum.selectedAddress,
      mgAddress
    );

    try {
      const amountAllowed = Math.ceil(ethers.utils.formatEther(slabsAllowance));
      if (amountAllowed < mintPrice) {
        await slabsContract.approve(mgAddress, ethers.utils.parseEther("9999"));
        await delay(15000);
      }
      await mgContract.requestNewMonster();
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="centerDiv">
        <h1>Monster NFT Collection</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={mintToken}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : <div>Mint Monster - {mintPrice} SLABS</div>}
        </button>
      </div>
      <div className="container">
        <div className="row">
          {monsterArray.map((data) => (
            <div key={`${data.tokenId}${data.power}`} className="col-sm">
              <NFTImage
                tokenId={data.tokenId}
                power={data.power}
                monsterTypeId={data.monsterTypeId}
                labMonsterContract={lmContract}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
