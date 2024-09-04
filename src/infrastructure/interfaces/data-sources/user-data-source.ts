import {
  UserRequestModel,
  UserResponseModel,
} from "../../../domain/models/user";
import { ApiSimpleFilter } from "../../../presentation/api/type/api-simple-filter";

export interface UserDataSource {
  getAll(
    filter: ApiSimpleFilter
  ): Promise<{ items: UserResponseModel[]; total: number }>;
  create(user: UserRequestModel): void;
  updateOne(id: string, user: UserRequestModel): void;
  getOne(
    payload: string | Record<string, string>
  ): Promise<UserResponseModel | null>;
  deleteOne(id: string): void;
  changePassword(id: string, password: string): void;
}
