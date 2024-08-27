import { ApiSimpleFilter } from "../../../presentation/type/api-simple-filter";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../models/categories";

export interface CategoriesRepository {
  getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  createOne(categories: CategoriesRequestModel): void;
  deleteOne(id: string): void;
  getOne(
    payload: string | Record<string, string>
  ): Promise<CategoriesResponseModel | null>;
  updateOne(id: string, category: CategoriesRequestModel): void;
}
