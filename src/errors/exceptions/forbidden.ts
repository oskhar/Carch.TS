import { ApiStatusEnum } from "../../presentation/enums/api-status-enum";

export class Forbidden extends Error {
  readonly statusCode = ApiStatusEnum.FORBIDDEN;
  readonly description = "Attempted unauthorized access detected.";
  constructor(message: string) {
    super(message);
    this.name = "Forbidden";
  }
}
