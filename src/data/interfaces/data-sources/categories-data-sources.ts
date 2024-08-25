import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import { ApiSimpleFilter } from "../../type/api-simple-filter";

export interface CategoriesDataSource {
  getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  create(categories: CategoriesRequestModel): Promise<void>;
  updateOne(id: string, categories: CategoriesRequestModel): Promise<void>;
  getOne(id: string): Promise<CategoriesResponseModel | null>;
  deleteOne(id: string): Promise<void>;
  find(payload: string, value?: any): Promise<boolean>;
}
