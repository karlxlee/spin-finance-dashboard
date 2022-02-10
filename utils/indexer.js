import { Sequelize, QueryTypes } from "sequelize";
import pg from "pg"
import config from "../config.json";

const indexer = new Sequelize(config["indexer_uri"], {
  dialect: "postgres",
  dialectModule: pg,
});
(async () => {
  await indexer.authenticate();
})();
export { indexer, QueryTypes };
