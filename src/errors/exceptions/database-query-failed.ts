import { ApiStatusEnum } from "../../data/enums/api-status-enum";

export class DatabaseQueryFailed extends Error {
  readonly statusCode = ApiStatusEnum.INTERNAL_SERVER_ERROR;
  readonly description = "Database query failed.";
  constructor(message: string) {
    super(message);
    this.name = "DatabaseQueryFailed";
  }
}
