import { ApiSimpleFilter } from "../../presentation/type/api-simple-filter";
import { ConflictUniqueData } from "../../errors/exceptions/conflict-unique-data";
import { DataNotFound } from "../../errors/exceptions/data-not-found";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import { CategoriesUseCase } from "../interfaces/use-case/categories-use-case";
import {
  CategoriesResponseModel,
  CategoriesRequestModel,
} from "../models/categories";

export class CategoriesUseCaseImpl implements CategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const result = await this.categoriesRepository.getCategories(filter);

    if (result.total < 1) throw new DataNotFound("Categories is empty");

    return result;
  }

  async createOne(categories: CategoriesRequestModel): Promise<void> {
    if (await this.categoriesRepository.find("name", categories.name))
      throw new ConflictUniqueData(
        `"name" is unique and [${categories.name}] already exists`
      );
    await this.categoriesRepository.createOne(categories);
  }

  async deleteOne(id: string): Promise<void> {
    if (!(await this.categoriesRepository.find(id)))
      throw new DataNotFound(`Category with id ${id} not found`);

    await this.categoriesRepository.deleteOne(id);
  }

  async getOne(id: string): Promise<CategoriesResponseModel> {
    const result = await this.categoriesRepository.getOne(id);
    if (!result) throw new DataNotFound("Category with id ${id} not found");

    return result;
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    if (!(await this.categoriesRepository.find(id)))
      throw new DataNotFound(`Category with id ${id} not found`);

    await this.categoriesRepository.updateOne(id, categories);
  }
}
