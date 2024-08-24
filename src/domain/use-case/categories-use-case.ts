import { ApiSimpleFilter } from "../../data/APIs/type/api-simple-filter";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import { CategoriesUseCase } from "../interfaces/use-case/categories-use-case";
import {
  CategoriesResponseModel,
  CategoriesRequestModel,
} from "../models/categories";

export class CategoriesUseCaseImpl implements CategoriesUseCase {
  constructor(protected categoriesRepository: CategoriesRepository) {}

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const result = await this.categoriesRepository.getCategories(filter);
    return result;
  }
  async createOne(categories: CategoriesRequestModel): Promise<void> {
    const result = await this.categoriesRepository.createOne(categories);
  }
  async deleteOne(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getOne(id: string): Promise<CategoriesResponseModel> {
    throw new Error("Method not implemented.");
  }
  async updateOne(id: string, category: CategoriesRequestModel): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
