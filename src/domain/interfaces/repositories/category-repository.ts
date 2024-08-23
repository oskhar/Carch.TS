import { ApiSimpleFilter } from "../../../data/APIs/type/api-simple-filter";
import {
  CategoryRequestModel,
  CategoryResponseModel,
} from "../../models/category";

export interface CategoryRepository {
  getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoryResponseModel[]; total: number }>;
  createOne(category: CategoryRequestModel): void;
  deleteOne(id: string): void;
  getCategory(id: string): Promise<CategoryResponseModel>;
  updateOne(id: string, category: CategoryRequestModel): void;
}
