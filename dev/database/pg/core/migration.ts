import { Client } from "pg";
import Blueprint from "./blueprint";

export default abstract class Migration {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  protected abstract up(): Promise<void>;
  protected abstract down(): Promise<void>;

  protected schema = {
    create: async (
      tableName: string,
      callback: (table: Blueprint) => void
    ): Promise<void> => {
      const blueprint = new Blueprint();
      callback(blueprint);
      const sql = blueprint.toSql(tableName);
      await this.runSql(sql);
    },

    dropIfExists: async (tableName: string): Promise<void> => {
      const blueprint = new Blueprint();
      const sql = blueprint.dropTableSql(tableName);
      await this.runSql(sql);
    },
  };

  private async runSql(sql: string): Promise<void> {
    try {
      await this.client.query(sql);
    } catch (error) {
      console.error("SQL execution failed:", error);
      throw error;
    }
  }
}
