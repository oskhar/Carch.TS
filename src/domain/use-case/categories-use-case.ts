import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";
import { CategoriesRepository } from "../interfaces/repositories/categories-repository";
import { CategoriesUseCase } from "../interfaces/use-case/categories-use-case";
import {
  CategoriesResponseModel,
  CategoriesRequestModel,
} from "../models/categories";
import { NotFound } from "@/errors/exceptions/data-not-found";
import { Conflict } from "@/errors/exceptions/conflict";

export class CategoriesUseCaseImpl implements CategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const result = await this.categoriesRepository.getCategories(filter);

    if (result.total < 1) throw new NotFound("Categories is empty");

    return result;
  }

  async createOne(categories: CategoriesRequestModel): Promise<void> {
    if (await this.categoriesRepository.getOne({ name: categories.name }))
      throw new Conflict(`name: [${categories.name}] already exists`);
    await this.categoriesRepository.createOne(categories);
  }

  async deleteOne(id: string): Promise<void> {
    if (!(await this.categoriesRepository.getOne(id)))
      throw new NotFound(`Category with id ${id} not found`);

    await this.categoriesRepository.deleteOne(id);
  }

  async getOne(id: string): Promise<CategoriesResponseModel> {
    const result = await this.categoriesRepository.getOne(id);
    if (!result) throw new NotFound(`Category with id ${id} not found`);

    return result;
  }

  async updateOne(
    id: string,
    categories: CategoriesRequestModel
  ): Promise<void> {
    if (!(await this.categoriesRepository.getOne(id)))
      throw new NotFound(`Category with id ${id} not found`);

    if (await this.categoriesRepository.getOne({ name: categories.name }))
      throw new Conflict(`name: [${categories.name}] already exists`);

    await this.categoriesRepository.updateOne(id, categories);
  }
}
