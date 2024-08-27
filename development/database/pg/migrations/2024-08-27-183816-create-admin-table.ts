import Migration from "../core/migration";
import Blueprint from "../core/blueprint";

export default class AdminMigration extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("admin", (table: Blueprint) => {
      //
    });
  }

  public async down(): Promise<void> {
    await this.schema.dropIfExists("admin");
  }
}
