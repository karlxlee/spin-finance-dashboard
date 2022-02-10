import { Sequelize, QueryTypes } from "sequelize";
import config from "../config.json";

const indexer = new Sequelize(config["indexer_uri"], {
  dialect: "postgres",
});
(async () => {
  await indexer.authenticate();
})();
export { indexer, QueryTypes };
