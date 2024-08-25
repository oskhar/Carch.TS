import { PoolClient } from "pg";
import { categoriesSeeder } from "./categories-seeder";
import { ProductsSeeder } from "./products-seeder";

export const seeders = [
  /**
   * Tambahkan seeder di sini
   *
   */
  (client: PoolClient) => categoriesSeeder(client),
  (client: PoolClient) => ProductsSeeder(client),
];
