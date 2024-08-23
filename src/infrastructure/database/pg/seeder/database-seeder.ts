import { PoolClient } from "pg";
import { categoriesSeeder } from "./categories-seeder";
import { ProductsSeeder } from "./products-seeder";

export const seeders = [
  (client: PoolClient) => categoriesSeeder(client),
  (client: PoolClient) => ProductsSeeder(client),
  // Tambahkan seeder lain di sini
];
