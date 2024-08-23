import { ApiSimpleFilter } from "../../../data/APIs/type/api-simple-filter";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../models/categories";

export interface CategoriesRepository {
  getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  createOne(category: CategoriesRequestModel): void;
  deleteOne(id: string): void;
  getCategory(id: string): Promise<CategoriesResponseModel>;
  updateOne(id: string, category: CategoriesRequestModel): void;
}
