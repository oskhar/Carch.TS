import dotenv from "dotenv";
import { startServer } from "./server";
import { PGDatabaseConfig } from "./data/interfaces/database/pg-database-config";
import { Pool } from "pg";
import { SQLDatabaseWrapper } from "./data/interfaces/database/sql-database-wrapper";

dotenv.config();

async function getPGDS() {
  const dbConfig: PGDatabaseConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT as string) || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "express",
  };
  const db: SQLDatabaseWrapper = await new Pool(dbConfig);
  return db;
}

(async () => {
  await startServer(await getPGDS());
})();
