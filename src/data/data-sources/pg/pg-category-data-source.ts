import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import {
  getSortOption,
  SortOption,
} from "../../APIs/enums/api-simple-sort-enum";
import { ApiSimpleFilter } from "../../APIs/type/api-simple-filter";
import { CategoriesDataSource } from "../../interfaces/data-sources/categories-data-sources";
import { SQLDatabaseWrapper } from "../../interfaces/database/sql-database-wrapper";

const DB_TABLE = "categories";
export class PGCategoriesDataSource implements CategoriesDataSource {
  constructor(private db: SQLDatabaseWrapper) {}

  async getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const { page, length, search, sort } = filter;

    let query = `SELECT * FROM ${DB_TABLE}`;
    let countQuery = `SELECT COUNT(*) FROM ${DB_TABLE}`;
    const values: string[] = [];
    const conditions: string[] = [];
    const sortOption: SortOption = getSortOption(sort);

    if (search) {
      conditions.push("name ILIKE $1");
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY ${sortOption.column} ${sortOption.direction}`;
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(`${length}`, `${(page - 1) * length}`);

    const dbResponse = await this.db.query(query, values);

    const totalResponse = await this.db.query(
      countQuery,
      values.slice(0, values.length - 2)
    );

    const items = dbResponse.rows.map((item) => ({
      id: item.id,
      name: item.name,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
    const total = parseInt(totalResponse.rows[0].count, 10);

    return { items, total };
  }

  async create(categories: CategoriesRequestModel): Promise<void> {
    await this.db.query(
      `
      INSERT INTO ${DB_TABLE} (name)
      VALUES ($1)
    `,
      [categories.name]
    );
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    await this.db.query(
      `
      UPDATE ${DB_TABLE}
        SET name = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [categories.name, id]
    );
  }

  async getOne(id: string): Promise<CategoriesResponseModel | null> {
    const result = await this.db.query(
      `SELECT * FROM ${DB_TABLE} WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const { name, created_at, updated_at } = result.rows[0];
    return { id, name, created_at, updated_at };
  }

  async deleteOne(id: string): Promise<void> {
    await this.db.query(`DELETE FROM ${DB_TABLE} WHERE id = $1`, [id]);
  }
}
