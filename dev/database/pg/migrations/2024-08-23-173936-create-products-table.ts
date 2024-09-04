import Migration from "../core/migration";
import Blueprint from "../core/blueprint";

export default class ProductsMigration extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("products", (table: Blueprint) => {
      table.id();
      table.string("name");
      table.string("description").nullable();
      table.bigInteger("price");
      table.string("currency").default("rp");
      table.string("quantity");
      table.boolean("active").default(true);
      table.foreignId("category_id").constrained();
      table.timestamps();
    });
  }

  public async down(): Promise<void> {
    await this.schema.dropIfExists("products");
  }
}
