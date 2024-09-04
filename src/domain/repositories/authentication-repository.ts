import { UserDataSource } from "@/infrastructure/interfaces/data-sources/user-data-source";
import { AuthenticationRepository } from "../interfaces/repositories/authentication-repository";
import {
  AuthenticationRequestModel,
  AuthenticationResponseModel,
} from "../models/authentication";
import { wrapRepositoryException } from "@/errors/handler/wrap-repository-exception";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(private readonly userDataSource: UserDataSource) {
    return wrapRepositoryException(this);
  }
  async changePassword(id: string, password: string): Promise<void> {
    await this.userDataSource.changePassword(id, password);
  }
}
