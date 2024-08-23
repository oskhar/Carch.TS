import { ApiSimpleFilter } from "../../../data/APIs/type/api-simple-filter";
import { CategoryRepository } from "../../interfaces/repositories/category-repository";
import { GetAllCategoryUseCase } from "../../interfaces/use-case/category/get-all-category-use-case";
import { CategoryResponseModel } from "../../models/category";

export class GetAllCategory implements GetAllCategoryUseCase {
  constructor(protected categoryRepository: CategoryRepository) {}

  async execute(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoryResponseModel[]; total: number }> {
    const result = await this.categoryRepository.getCategories(filter);
    return result;
  }
}
