import {
  CategoryRequestModel,
  CategoryResponseModel,
} from "../../../domain/models/category";
import { ApiSimpleFilter } from "../../APIs/type/api-simple-filter";

export interface CategoryDataSource {
  getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: CategoryResponseModel[]; total: number }>;
  create(category: CategoryRequestModel): void;
  updateOne(id: string, category: CategoryRequestModel): void;
  getOne(id: string): Promise<CategoryResponseModel | null>;
  deleteOne(id: string): void;
}
