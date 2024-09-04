import {
  AuthenticationRequestModel,
  AuthenticationResponseModel,
} from "@/domain/models/authentication";
import { UserResponseModel } from "@/domain/models/user";

export interface AuthenticationUseCase {
  login(data: AuthenticationRequestModel): Promise<AuthenticationResponseModel>;
  refresh(): Promise<AuthenticationResponseModel>;
  me(): Promise<UserResponseModel>;
  logout(): void;
}
