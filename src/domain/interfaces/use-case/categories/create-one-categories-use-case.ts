import { CategoriesRequestModel } from "../../../models/categories";

export interface CreateOneCategoriesUseCase {
  execute(categories: CategoriesRequestModel): Promise<void>;
}
