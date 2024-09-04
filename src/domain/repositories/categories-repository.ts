import { CategoriesDataSource } from "@/infrastructure/interfaces/data-sources/categories-data-sources";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../models/categories";
import { wrapRepositoryException } from "@/errors/handler/wrap-repository-exception";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export class CategoriesRepositoryImpl implements CategoriesRepository {
  constructor(private readonly categoriesDataSource: CategoriesDataSource) {
    return wrapRepositoryException(this);
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

  async getOne(
    payload: string | Record<string, string>
  ): Promise<CategoriesResponseModel | null> {
    return await this.categoriesDataSource.getOne(payload);
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    await this.categoriesDataSource.updateOne(id, categories);
  }
}
