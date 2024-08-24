import { ApiSimpleFilter } from "../../../data/APIs/type/api-simple-filter";
import { CategoriesRepository } from "../../interfaces/repositories/categories-repository";
import { GetAllCategoriesUseCase } from "../../interfaces/use-case/categories/get-all-categories-use-case";
import { CategoriesResponseModel } from "../../models/categories";

export class GetAllCategories implements GetAllCategoriesUseCase {
  constructor(protected categoriesRepository: CategoriesRepository) {}

  async execute(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }> {
    const result = await this.categoriesRepository.getCategories(filter);
    return result;
  }
}
