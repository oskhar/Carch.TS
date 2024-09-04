import {
  UserRequestModel,
  UserResponseModel,
} from "../../../domain/models/user";
import { Forbidden } from "../../../errors/exceptions/forbidden";
import {
  getSortOption,
  SortOption,
} from "../../../presentation/api/enums/api-simple-sort-enum";
import { ApiSimpleFilter } from "../../../presentation/api/type/api-simple-filter";
import { UserDataSource } from "../../interfaces/data-sources/user-data-source";
import { SQLDatabaseWrapper } from "../../interfaces/database/sql-database-wrapper";

export class PGUserDataSource implements UserDataSource {
  private readonly db_table = "user";
  private readonly exposed_columns = ["name", "email"];

  constructor(private readonly db: SQLDatabaseWrapper) {}

  async getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: UserResponseModel[]; total: number }> {
    let query = `SELECT * FROM ${this.db_table}`;
    let countQuery = `SELECT COUNT(*) FROM ${this.db_table}`;
    const values: string[] = [];
    const conditions: string[] = [];
    const sortOption: SortOption = getSortOption(filter.sort);

    if (filter.search) {
      const searchConditions = this.exposed_columns.map((column, index) => {
        values.push(`%${filter.search}%`);
        return `${column} ILIKE $${index + 1}`;
      });

      conditions.push(`(${searchConditions.join(" OR ")})`);
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

    const items = dbResponse.rows.map(
      (item) =>
        ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role,
          created_at: item.created_at,
          updated_at: item.updated_at,
        } as UserResponseModel)
    );

    const total = parseInt(totalResponse.rows[0].count, 10);

    return { items, total };
  }

  async create(user: UserRequestModel): Promise<void> {
    await this.db.query(
      `
      INSERT INTO ${this.db_table} (name, email, password)
      VALUES ($1, $2, $3)
    `,
      [user.name, user.email, user.password]
    );
  }

  async updateOne(id: string, user: UserRequestModel): Promise<void> {
    await this.db.query(
      `
      UPDATE ${this.db_table}
        SET name = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [user.name, id]
    );
  }

  async getOne(
    payload: string | Record<string, string>
  ): Promise<UserResponseModel | null> {
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

    const item = rows[0];
    return {
      id: item.id,
      name: item.name,
      created_at: item.created_at,
      updated_at: item.updated_at,
    } as UserResponseModel;
  }

  async deleteOne(id: string): Promise<void> {
    await this.db.query(`DELETE FROM ${this.db_table} WHERE id = $1`, [id]);
  }
}
