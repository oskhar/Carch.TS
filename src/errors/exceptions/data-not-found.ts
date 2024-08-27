import { ApiStatusEnum } from "../../presentation/enums/api-status-enum";

export class DataNotFound extends Error {
  readonly statusCode = ApiStatusEnum.NOT_FOUND;
  readonly description = "Not Found Data.";
  constructor(message: string) {
    super(message);
    this.name = "DataNotFound";
  }
}
