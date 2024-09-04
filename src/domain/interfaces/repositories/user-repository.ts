import {
  UserRequestModel,
  UserResponseModel,
} from "@/domain/models/user";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export interface UserRepository {
  getUser(
    filter: ApiSimpleFilter
  ): Promise<{ items: UserResponseModel[]; total: number }>;
  createOne(user: UserRequestModel): void;
  deleteOne(id: string): void;
  getOne(
    payload: string | Record<string, string>
  ): Promise<UserResponseModel | null>;
  updateOne(id: string, category: UserRequestModel): void;
}
