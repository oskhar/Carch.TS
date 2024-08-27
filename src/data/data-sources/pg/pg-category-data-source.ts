import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import { Forbidden } from "../../../errors/exceptions/forbidden";
import { isNumeric } from "../../../infrastructure/utils/string-checker";
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

  async find(payload: string, value?: any): Promise<boolean> {
    if (!this.exposed_columns.includes(payload) && !isNumeric(payload))
      throw new Forbidden("Invalid column or bypass attempt.");

    let query: string = `SELECT 1 FROM ${this.db_table} WHERE id = $1 LIMIT 1`;
    let queryParam: any = payload;

    if (!isNumeric(payload)) {
      query = `SELECT 1 FROM ${this.db_table} WHERE ${payload} = $1 LIMIT 1`;
      queryParam = value;
    }

    const { rows } = await this.db.query(query, [queryParam]);

    return rows.length > 0;
  }

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

  async getOne(id: string): Promise<CategoriesResponseModel | null> {
    const result = await this.db.query(
      `SELECT * FROM ${this.db_table} WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;

    const { name, created_at, updated_at } = result.rows[0];
    return { id, name, created_at, updated_at };
  }

  async deleteOne(id: string): Promise<void> {
    await this.db.query(`DELETE FROM ${this.db_table} WHERE id = $1`, [id]);
  }
}
