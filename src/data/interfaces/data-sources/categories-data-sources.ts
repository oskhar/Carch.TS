import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../../domain/models/categories";
import { ApiSimpleFilter } from "../../APIs/type/api-simple-filter";

export interface CategoriesDataSource {
  getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  create(category: CategoriesRequestModel): void;
  updateOne(id: string, category: CategoriesRequestModel): void;
  getOne(id: string): Promise<CategoriesResponseModel | null>;
  deleteOne(id: string): void;
}
