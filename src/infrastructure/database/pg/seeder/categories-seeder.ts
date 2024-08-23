import { faker } from "@faker-js/faker";
import { PoolClient } from "pg";

export async function categoriesSeeder(client: PoolClient) {
  const categories = [];
  const length = 10;

  for (let i = 0; i < length; i++) {
    categories.push({
      name: faker.name.firstName(),
    });
  }

  for (const item of categories) {
    await client.query("INSERT INTO categories (name) VALUES ($1)", [
      item.name,
    ]);
  }

  console.log("categories seeded");
}
