import React, { useEffect, useState } from "react";

const NFTImage = ({ tokenId, power, monsterTypeId, labMonsterContract }) => {
  const [tokenUri, setTokenUri] = useState("");

  const getTokenUri = async () => {
    const tokenUri = await labMonsterContract.getTokenURI(tokenId);
    setTokenUri(tokenUri.toString());
  };

  useEffect(() => {
    getTokenUri();
  }, []);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg card">
      <a className="center-button" href={tokenUri} target="_blank">
        See Token URI
      </a>
      <div className="nft-grid-image">
        <img
          className="w-full nft-image"
          src={`./monsters/images/monster-${monsterTypeId}.png`}
        />
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          ID: {tokenId}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          POWER: {power}
        </span>
      </div>
    </div>
  );
};

export default NFTImage;
