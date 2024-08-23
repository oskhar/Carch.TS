import { ApiSimpleFilter } from "../../../../data/APIs/type/api-simple-filter";
import { CategoriesResponseModel } from "../../../models/categories";

export interface GetAllCategoriesUseCase {
  execute(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
}
