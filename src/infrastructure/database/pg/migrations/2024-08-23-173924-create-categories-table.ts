import Migration from "../core/migration";
import Blueprint from "../core/blueprint";

export default class CategoriesMigration extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("categories", (table: Blueprint) => {
      table.id();
      table.string("name");
      table.timestamps();
    });
  }

  public async down(): Promise<void> {
    await this.schema.dropIfExists("categories");
  }
}
