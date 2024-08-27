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
  getOne(id: string): Promise<CategoriesResponseModel | null>;
  updateOne(id: string, category: CategoriesRequestModel): void;
  find(payload: string, value?: any): Promise<boolean>;
}
