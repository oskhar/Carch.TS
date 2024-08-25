import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";

export class ForbiddenException extends Error {
  readonly statusCode = ApiStatusEnum.FORBIDDEN;
  readonly description = "Attempted unauthorized access detected.";
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
  }
}
