import { Sequelize, QueryTypes } from "sequelize";

const indexer = new Sequelize(
  "postgres://public_readonly:nearprotocol@testnet.db.explorer.indexer.near.dev/testnet_explorer",
  {
    dialect: "postgres",
  }
);

export { indexer, QueryTypes };
