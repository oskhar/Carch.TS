import Migration from "../core/migration";
import Blueprint from "../core/blueprint";

export default class UsersMigration extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("users", (table: Blueprint) => {
      table.id();
      table.string("nickname");
      table.string("name");
      table.string("email").unique();
      table.string("role");
      table.string("password");
      table.timestamp("email_verif_at");
      table.timestamps();
    });
  }

  public async down(): Promise<void> {
    await this.schema.dropIfExists("users");
  }
}
