import { ApiSimpleFilter } from "../../data/APIs/type/api-simple-filter";
import { CategoryDataSource } from "../../data/interfaces/data-sources/category-data-sources";
import { CategoryRepository } from "../interfaces/repositories/category-repository";
import {
  CategoryRequestModel,
  CategoryResponseModel,
} from "../models/category";

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(protected categoryDataSource: CategoryDataSource) {}

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoryResponseModel[]; total: number }> {
    const result = await this.categoryDataSource.getAll(filter);
    return result;
  }

  createOne(category: CategoryRequestModel): void {
    this.categoryDataSource.create(category);
  }

  deleteOne(id: string): void {
    throw new Error("Method not implemented.");
  }

  getCategory(id: string): Promise<CategoryResponseModel> {
    throw new Error("Method not implemented.");
  }

  updateOne(id: string, category: CategoryRequestModel): void {
    throw new Error("Method not implemented.");
  }
}
