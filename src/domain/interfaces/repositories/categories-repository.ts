import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "@/domain/models/categories";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

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
