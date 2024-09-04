import { Dialect, Options } from "sequelize";

export interface SequelizeDatabaseConfig extends Options {
  database: string;
  username: string;
  password: string;
}

let sequelizeInstance: SequelizeDatabaseConfig | null = null;

export const sequelizeConfigSingleton = (): SequelizeDatabaseConfig => {
  if (!sequelizeInstance) {
    sequelizeInstance = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "express",
      dialect: "postgres" as Dialect,
      logging: false, // Optional, turn off logging
    };
  }

  return sequelizeInstance;
};
