import {
  CategoriesRequestModel,
  CategoriesResponseModel,
} from "@/domain/models/categories";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export interface CategoriesUseCase {
  getCategories(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoriesResponseModel[]; total: number }>;
  createOne(categories: CategoriesRequestModel): void;
  deleteOne(id: string): void;
  getOne(id: string): Promise<CategoriesResponseModel>;
  updateOne(id: string, categories: CategoriesRequestModel): void;
}
