import { ApiSimpleFilter } from "../../data/APIs/type/api-simple-filter";
import { CategoriesDataSource } from "../../data/interfaces/data-sources/categories-data-sources";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../models/categories";

export class CategoriesRepositoryImpl implements CategoriesRepository {
  constructor(protected categoriesDataSource: CategoriesDataSource) {}

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const result = await this.categoriesDataSource.getAll(filter);
    return result;
  }

  createOne(categories: CategoriesRequestModel): void {
    this.categoriesDataSource.create(categories);
  }

  deleteOne(id: string): void {
    this.categoriesDataSource.deleteOne(id);
  }

  getOne(id: string): Promise<CategoriesResponseModel> {
    throw new Error("Method not implemented.");
  }

  updateOne(id: string, categories: CategoriesRequestModel): void {
    throw new Error("Method not implemented.");
  }
}
