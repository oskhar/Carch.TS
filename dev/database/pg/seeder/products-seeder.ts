import { faker } from "@faker-js/faker";
import { PoolClient } from "pg";

export async function ProductsSeeder(client: PoolClient) {
  const Products = [];
  const length = 10;

  for (let i = 0; i < length; i++) {
    Products.push({
      name: faker.name.fullName(),
      description: faker.address.streetAddress(),
      price: faker.datatype.number({ min: 5, max: 100000 }) * 1000,
      quantity: faker.datatype.number({ min: 0, max: 200 }),
    });
  }

  for (const item of Products) {
    await client.query(
      `INSERT INTO Products (name, description, price, quantity, category_id)
                      VALUES ($1, $2, $3, $4, $5)`,
      [
        item.name,
        item.description,
        item.price,
        item.quantity,
        getRandomNumber(1, length),
      ]
    );
  }

  function getRandomNumber(min: number, max: number): number {
    if (min >= max) {
      throw new Error("Min should be less than max");
    }
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min + "");
  }

  console.log("Products seeded");
}
