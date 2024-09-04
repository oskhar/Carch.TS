import dotenv from "dotenv";
import { startServer } from "./server";
import {
  dbPGConfigSingleton,
  PGDatabaseConfig,
} from "./infrastructure/interfaces/database/pg-database-config";
import { Pool } from "pg";
import { SQLDatabaseWrapper } from "./infrastructure/interfaces/database/sql-database-wrapper";
import {
  sequelizeConfigSingleton,
  SequelizeDatabaseConfig,
} from "./infrastructure/interfaces/database/sequelize-database-config";
import { Sequelize } from "sequelize";

dotenv.config();

/**
 * Database postgre dengan library pg
 */
async function getPGDS(): Promise<SQLDatabaseWrapper> {
  const config: PGDatabaseConfig = dbPGConfigSingleton();
  const db: SQLDatabaseWrapper = new Pool(config);

  return db;
}

/**
 * Database postgre dengan library sequelize
 */
async function getSequelizeInstance(): Promise<Sequelize> {
  const config: SequelizeDatabaseConfig = sequelizeConfigSingleton();
  const sequelize = new Sequelize(config);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelize;
}

(async () => {
  await startServer(await getSequelizeInstance());
})();
