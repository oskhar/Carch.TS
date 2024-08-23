import { Command } from "commander";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

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

async function runMigrations() {
  const client = await pool.connect();

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
  } finally {
    client.release();
  }
}

program.description("Run all database migrations").action(async () => {
  await runMigrations();
});

program.parse(process.argv);
