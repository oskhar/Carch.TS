import { ApiSimpleFilter } from "../../../data/type/api-simple-filter";
import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "../../models/categories";

export interface CategoriesUseCase {
  getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  createOne(categories: CategoriesRequestModel): void;
  deleteOne(id: string): void;
  getOne(id: string): Promise<CategoriesResponseModel>;
  updateOne(id: string, categories: CategoriesRequestModel): void;
}
