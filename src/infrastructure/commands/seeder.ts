import { Command } from "commander";
import dotenv from "dotenv";
import { Pool } from "pg";
import { seeders } from "../database/pg/seeder/database-seeder";

dotenv.config();

const program = new Command();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "express",
});

async function runSeeders() {
  const client = await pool.connect();

  try {
    for (const seeder of seeders) {
      console.log(`Running seeder: ${seeder.name}`);
      await seeder(client);
    }
    console.log("All seeders have been run successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    client.release();
  }
}

program.description("Run all database seeders").action(async () => {
  await runSeeders();
});

program.parse(process.argv);
