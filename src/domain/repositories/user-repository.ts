import { UserDataSource } from "@/infrastructure/interfaces/data-sources/user-data-source";
import { UserRepository } from "../interfaces/repositories/user-repository";
import { UserRequestModel, UserResponseModel } from "../models/user";
import { wrapRepositoryException } from "@/errors/handler/wrap-repository-exception";
import { ApiSimpleFilter } from "@/presentation/api/type/api-simple-filter";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDataSource) {
    return wrapRepositoryException(this);
  }

  async getUser(
    filter: ApiSimpleFilter
  ): Promise<{ items: UserResponseModel[]; total: number }> {
    return await this.userDataSource.getAll(filter);
  }

  async createOne(user: UserRequestModel): Promise<void> {
    this.userDataSource.create(user);
  }

  async deleteOne(id: string): Promise<void> {
    this.userDataSource.deleteOne(id);
  }

  async getOne(
    payload: string | Record<string, string>
  ): Promise<UserResponseModel | null> {
    return await this.userDataSource.getOne(payload);
  }

  async updateOne(id: string, user: UserRequestModel): Promise<void> {
    await this.userDataSource.updateOne(id, user);
  }
}
