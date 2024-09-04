import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import { Forbidden } from "../../../errors/exceptions/forbidden";
import {
  getSortOption,
  SortOption,
} from "../../../presentation/api/enums/api-simple-sort-enum";
import { ApiSimpleFilter } from "../../../presentation/api/type/api-simple-filter";
import { CategoriesDataSource } from "../../interfaces/data-sources/categories-data-sources";
import { Sequelize, Model, DataTypes, Op, ModelStatic } from "sequelize";

export class SequelizeCategoriesDataSource implements CategoriesDataSource {
  private readonly exposed_columns = ["name"];
  private readonly model: ModelStatic<
    Model<CategoriesResponseModel, CategoriesRequestModel>
  >;

  constructor(private readonly sequelize: Sequelize) {
    this.model = this.initCategoriesModel(sequelize);
  }

  private initCategoriesModel(
    sequelize: Sequelize
  ): ModelStatic<Model<CategoriesResponseModel, CategoriesRequestModel>> {
    return sequelize.define<
      Model<CategoriesResponseModel, CategoriesRequestModel>
    >(
      "categories",
      {
        id: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "categories",
        timestamps: false,
      }
    );
  }

  async getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
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

    const mappedItems: CategoriesResponseModel[] = items.map((item) => {
      const { id, name, created_at, updated_at } =
        item.get() as CategoriesResponseModel;
      return {
        id,
        name,
        created_at,
        updated_at,
      };
    });

    return { items: mappedItems, total };
  }

  async create(categories: CategoriesRequestModel): Promise<void> {
    await this.model.create(categories);
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    const [updatedCount] = await this.model.update(
      {
        ...categories,
        updated_at: new Date().toISOString(),
      },
      { where: { id } }
    );

    if (updatedCount === 0) {
      throw new Error(`Update failed: No record found with id=${id}`);
    }
  }

  async getOne(
    payload: string | Record<string, string>
  ): Promise<CategoriesResponseModel | null> {
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

    const { id, name, created_at, updated_at } =
      item.get() as CategoriesResponseModel;

    return {
      id,
      name,
      created_at,
      updated_at,
    } as CategoriesResponseModel;
  }

  async deleteOne(id: string): Promise<void> {
    await this.model.destroy({ where: { id } });
  }
}
