import { UserRequestModel, UserResponseModel } from "@/domain/models/user";
import { Forbidden } from "@/errors/exceptions/forbidden";
import { UserDataSource } from "@/infrastructure/interfaces/data-sources/user-data-source";
import {
  getSortOption,
  SortOption,
} from "@/presentation/api/enums/api-simple-sort-enum";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";
import { DataTypes, Model, ModelStatic, Op, Sequelize } from "sequelize";

export class SequelizeUserDataSource implements UserDataSource {
  private readonly exposed_columns = ["name", "email", "nickname"];
  private readonly model: ModelStatic<
    Model<UserResponseModel, UserRequestModel>
  >;

  constructor(private readonly sequelize: Sequelize) {
    this.model = this.initUserModel(sequelize);
  }

  private initUserModel(
    sequelize: Sequelize
  ): ModelStatic<Model<UserResponseModel, UserRequestModel>> {
    return sequelize.define<Model<UserResponseModel, UserRequestModel>>(
      "user",
      {
        id: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email_verif_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: "users",
        timestamps: false,
      }
    );
  }

  async getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: UserResponseModel[]; total: number }> {
    const whereClause: any = {};
    const sortOption: SortOption = getSortOption(filter.sort) || {
      column: "created_at",
      direction: "DESC",
    };

    if (filter.search) {
      whereClause[Op.or] = this.exposed_columns.map((column) => ({
        [column]: { [Op.iLike]: `%${filter.search}%` },
      }));
    }

    const { rows: items, count: total } = await this.model.findAndCountAll({
      where: whereClause,
      order: [[sortOption.column, sortOption.direction]],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10),
    });

    const mappedItems: UserResponseModel[] = items.map((item) => {
      const {
        id,
        name,
        email,
        role,
        nickname,
        created_at,
        updated_at,
        email_verif_at,
      } = item.get() as UserResponseModel;
      return {
        id,
        name,
        email,
        role,
        nickname,
        email_verif_at,
        created_at,
        updated_at,
      };
    });

    return { items: mappedItems, total };
  }

  async create(user: UserRequestModel): Promise<void> {
    await this.model.create(user);
  }

  async updateOne(id: string, user: UserRequestModel): Promise<void> {
    const [updatedCount] = await this.model.update(
      {
        ...user,
        updated_at: new Date(),
      },
      { where: { id } }
    );

    if (updatedCount === 0) {
      throw new Error(`Update failed: No record found with id=${id}`);
    }
  }

  async getOne(
    payload: string | Record<string, string>
  ): Promise<UserResponseModel | null> {
    const whereClause: any =
      typeof payload === "string" ? { id: payload } : payload;

    if (typeof payload === "object") {
      for (const key in payload) {
        if (!this.exposed_columns.includes(key)) {
          throw new Forbidden("Invalid column or bypass attempt.");
        }
      }
    }

    const item = await this.model.findOne({ where: whereClause });

    if (!item) return null;

    const {
      id,
      name,
      email,
      role,
      password,
      nickname,
      created_at,
      updated_at,
      email_verif_at,
    } = item.get() as UserResponseModel;

    return {
      id,
      name,
      email,
      role,
      password,
      nickname,
      email_verif_at,
      created_at,
      updated_at,
    };
  }

  async deleteOne(id: string): Promise<void> {
    await this.model.destroy({ where: { id } });
  }

  async changePassword(id: string, password: string): Promise<void> {
    const [updatedCount] = await this.model.update(
      {
        password: password,
        updated_at: new Date(),
      },
      { where: { id } }
    );

    if (updatedCount === 0) {
      throw new Error(`Update failed: No record found with id=${id}`);
    }
  }
}
