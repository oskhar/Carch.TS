import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import { Forbidden } from "../../../errors/exceptions/forbidden";
import { isNumeric } from "../../utils/string-checker";
import {
  getSortOption,
  SortOption,
} from "../../../presentation/enums/api-simple-sort-enum";
import { ApiSimpleFilter } from "../../../presentation/type/api-simple-filter";
import { CategoriesDataSource } from "../../interfaces/data-sources/categories-data-sources";
import { SQLDatabaseWrapper } from "../../interfaces/database/sql-database-wrapper";

export class PGCategoriesDataSource implements CategoriesDataSource {
  private readonly db_table = "categories";
  private readonly exposed_columns = ["name"];

  constructor(private readonly db: SQLDatabaseWrapper) {}

  async getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    let query = `SELECT * FROM ${this.db_table}`;
    let countQuery = `SELECT COUNT(*) FROM ${this.db_table}`;
    const values: string[] = [];
    const conditions: string[] = [];
    const sortOption: SortOption = getSortOption(filter.sort);

    if (filter.search) {
      conditions.push("name ILIKE $1");
      values.push(`%${filter.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY ${sortOption.column} ${sortOption.direction}`;
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(`${filter.perPage}`, `${(filter.page - 1) * filter.perPage}`);

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
      INSERT INTO ${this.db_table} (name)
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
      UPDATE ${this.db_table}
        SET name = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [categories.name, id]
    );
  }

  async getOne(
    payload: string | Record<string, string>
  ): Promise<CategoriesResponseModel | null> {
    const isString = typeof payload === "string";
    const queryParam = isString ? [payload] : Object.values(payload);
    const conditions = isString
      ? "id = $1"
      : Object.keys(payload)
          .filter((key) => {
            if (!this.exposed_columns.includes(key))
              throw new Forbidden("Invalid column or bypass attempt.");
            return true;
          })
          .map((key, index) => `${key} = $${index + 1}`)
          .join(" AND ");

    const query = `SELECT * FROM ${this.db_table} WHERE ${conditions} LIMIT 1`;
    const { rows } = await this.db.query(query, queryParam);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    } as CategoriesResponseModel;
  }

  async deleteOne(id: string): Promise<void> {
    await this.db.query(`DELETE FROM ${this.db_table} WHERE id = $1`, [id]);
  }
}
