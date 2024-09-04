export interface PGDatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

let instance: PGDatabaseConfig | null = null;

export const dbPGConfigSingleton = (): PGDatabaseConfig => {
  if (!instance) {
    instance = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT as string) || 5432,
      user: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "express",
    };
  }

  return instance;
};
