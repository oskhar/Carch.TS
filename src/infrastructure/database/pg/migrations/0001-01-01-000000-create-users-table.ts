import Migration from "../core/migration";
import Blueprint from "../core/blueprint";

export default class CreateUsersTable extends Migration {
  public async up(): Promise<void> {
    await this.schema.create("users", (table: Blueprint) => {
      table.id();
      table.string("full_name");
      table.string("email").unique();
      table.string("password");
      table.enum("role", ["member", "admin"]);
      table.enum("gender", ["male", "female"]);
      table.enum("language", ["id", "en"]).default("id");
      table.string("profile_picture").nullable();
      table.string("phone_number").nullable();
      table.timestamp("birth_date").nullable();
      table.timestamp("email_verified_at").nullable();
      table.rememberToken();
      table.timestamps();
      table.softDeletes();
    });

    await this.schema.create("password_reset_tokens", (table: Blueprint) => {
      table.string("email").unique().primary();
      table.string("token");
      table.timestamp("created_at").nullable();
    });

    await this.schema.create("sessions", (table: Blueprint) => {
      table.string("id").unique().primary();
      table.integer("user_id").nullable().index("user_id");
      table.string("ip_address", 45).nullable();
      table.text("user_agent").nullable();
      table.text("payload");
      table.integer("last_activity").index("last_activity");
    });
  }

  public async down(): Promise<void> {
    await this.schema.dropIfExists("users");
    await this.schema.dropIfExists("password_reset_tokens");
    await this.schema.dropIfExists("sessions");
  }
}
