import { Command } from "commander";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool, PoolClient } from "pg";

dotenv.config();

const program = new Command();
const migrationsDir = path.resolve(__dirname, "../database/pg/migrations");
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "express",
});

async function rollbackMigrations(client: PoolClient) {
  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".ts"))
      .reverse();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const migration = await import(filePath);

      if (migration && typeof migration.default === "function") {
        const migrationInstance = new migration.default(client);

        if (
          migrationInstance.down &&
          typeof migrationInstance.down === "function"
        ) {
          console.log(`Rolling back migration: ${file}`);
          await migrationInstance.down();
        }
      }
    }

    console.log("All migrations have been rolled back successfully.");
  } catch (error) {
    console.error("Rollback failed:", error);
  }
}

async function runMigrations(client: PoolClient) {
  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".ts"));

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const migration = await import(filePath);

      if (migration && typeof migration.default === "function") {
        const migrationInstance = new migration.default(client);

        if (
          migrationInstance.up &&
          typeof migrationInstance.up === "function"
        ) {
          console.log(`Running migration: ${file}`);
          await migrationInstance.up();
        }
      }
    }

    console.log("All migrations have been run successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

async function migrateRefresh() {
  const client = await pool.connect();

  try {
    await rollbackMigrations(client);
    await runMigrations(client);
    console.log("Migrate refresh completed successfully.");
  } catch (error) {
    console.error("Migrate refresh failed:", error);
  } finally {
    client.release();
  }
}

program
  .description("Rollback all migrations and then run them again")
  .action(async () => {
    await migrateRefresh();
  });

program.parse(process.argv);
