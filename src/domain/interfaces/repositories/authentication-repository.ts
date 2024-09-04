import {
  AuthenticationRequestModel,
  AuthenticationResponseModel,
} from "@/domain/models/authentication";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export interface AuthenticationRepository {
  changePassword(id: string, password: string): void;
}
