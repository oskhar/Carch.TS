import { ApiSimpleFilter } from "../../../../data/APIs/type/api-simple-filter";
import { CategoryResponseModel } from "../../../models/category";

export interface GetAllCategoryUseCase {
  execute(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoryResponseModel[]; total: number }>;
}
