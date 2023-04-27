import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Monster } from "../repositories/monster";
import { Metadata } from "../repositories/metadata";
import { pinataConfig } from "../config";
import { isAddress } from "ethers/lib/utils";

export const metadataService = async (
  power,
  tokenId,
  monsterTypeId,
  blockNumber,
  monsterContract,
  metadataId
) => {
  try {
    const monsterMetadata = JSON.parse(
      await fs.promises.readFile(
        `../monsters/metadata/monster-${monsterTypeId}.json`,
        "utf8"
      )
    );

    monsterMetadata.attributes[0].value = power;

    const filename = `${monsterMetadata["name"]
      .toLowerCase()
      .replace(/\s/g, "-")}_${tokenId}.json`;

    const responseGet = await axios.get(
      pinataConfig.pinata_get_url + filename,
      {
        headers: {
          pinata_api_key: pinataConfig.pinata_api_key,
          pinata_secret_api_key: pinataConfig.pinata_api_secret,
        },
      }
    );

    console.log("checking if this token was already being pinned");
    if (responseGet.data.count == 0) {
      const filetotal = `./metadata-generated/${filename}`;

      let monsterMetadataString = JSON.stringify(monsterMetadata);
      fs.promises.writeFile(filetotal, monsterMetadataString);

      const formData = new FormData();
      formData.append("file", fs.createReadStream(filetotal));
      console.log("form data", formData);

      console.log("posting to pinata");
      const response = await axios.post(
        pinataConfig.pinata_post_url,
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataConfig.pinata_api_key,
            pinata_secret_api_key: pinataConfig.pinata_api_secret,
          },
        }
      );

      const ipfsHash = pinataConfig.ipfs_base_url + response.data.IpfsHash;

      console.log("lab monster set token uri with ipfsHash", ipfsHash);
      await monsterContract.setTokenURI(tokenId, ipfsHash);

      console.log("tokenUri has been set");
      const monsterObj = new Monster({
        tokenUri: ipfsHash,
        name: monsterMetadata.name,
        description: monsterMetadata.description,
        power,
        monsterTypeId,
      });

      await monsterObj.save();
    }

    await Metadata.updateOne({ id: metadataId }, { blockNumber });
  } catch (e) {
    console.log("Metadata Service Error", e);
  }
};
