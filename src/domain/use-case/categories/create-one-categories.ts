import { CategoriesRepository } from "../../interfaces/repositories/categories-repository";
import { CreateOneCategoriesUseCase } from "../../interfaces/use-case/categories/create-one-categories-use-case";
import { CategoriesRequestModel } from "../../models/categories";

export class CreateOneCategories implements CreateOneCategoriesUseCase {
  constructor(protected categoriesRepository: CategoriesRepository) {}

  async execute(categories: CategoriesRequestModel): Promise<void> {
    const result = await this.categoriesRepository.createOne(categories);
  }
}
