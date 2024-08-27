import { ApiSimpleFilter } from "../../data/type/api-simple-filter";
import { CategoriesDataSource } from "../../data/interfaces/data-sources/categories-data-sources";
import { wrapRepositoryException } from "../../errors/handler/wrap-repository-exception";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../models/categories";

export class CategoriesRepositoryImpl implements CategoriesRepository {
  constructor(protected categoriesDataSource: CategoriesDataSource) {
    return wrapRepositoryException(this);
  }

  async find(payload: string, value?: any): Promise<boolean> {
    return await this.categoriesDataSource.find(payload, value);
  }

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    return await this.categoriesDataSource.getAll(filter);
  }

  async createOne(categories: CategoriesRequestModel): Promise<void> {
    this.categoriesDataSource.create(categories);
  }

  async deleteOne(id: string): Promise<void> {
    this.categoriesDataSource.deleteOne(id);
  }

  async getOne(id: string): Promise<CategoriesResponseModel | null> {
    return await this.categoriesDataSource.getOne(id);
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    await this.categoriesDataSource.updateOne(id, categories);
  }
}
