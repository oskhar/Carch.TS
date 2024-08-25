import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";

export class QueryException extends Error {
  readonly statusCode = ApiStatusEnum.INTERNAL_SERVER_ERROR;
  readonly description = "Database query failed.";
  constructor(message: string) {
    super(message);
    this.name = "QueryException";
  }
}
