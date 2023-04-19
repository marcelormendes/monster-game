import dotenv from "dotenv-safe";

dotenv.config({ allowEmptyValues: true });

export const app = {
  name: "Lab Monster Metadata Server",
  version: "1.0.0",
  host: process.env.APP_HOST || "",
  port: +(process.env.APP_PORT || "0"),
  urlPrefix: process.env.APP_URL_PREFIX || "",
  environment: process.env.NODE_ENV || "development",
};

export const logging = {
  level: (process.env.LOG_LEVEL || "info").toLowerCase(),
};

export const dbConfig = {
  db_name: process.env.DB_NAME || "testdb",
  db_username: process.env.DB_USERNAME || "admin",
  db_password: process.env.DB_PASSWORD || "12345",
};

export const pinataConfig = {
  pinata_api_key: process.env.PINATA_API_KEY || "",
  pinata_api_secret: process.env.PINATA_API_SECRET || "",
  ipfs_base_url: process.env.IPFS_BASE_URL || "https://ipfs.io/ipfs/",
  pinata_get_url:
    process.env.PINATA_GET_URL ||
    "https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=",
  pinata_post_url:
    process.env.PINATA_POST_URL ||
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
};

export const blockChainConfig = {
  network_url: process.env.NETWORK_URL || null,
  network_id: process.env.NETWORK_ID || "80001",
};
