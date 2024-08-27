import { ApiStatusEnum } from "../../data/enums/api-status-enum";

export class Unauthenticated extends Error {
  readonly statusCode = ApiStatusEnum.UNAUTHORIZED;
  readonly description = "Unauthenticated.";
  constructor(message: string) {
    super(message);
    this.name = "Unauthenticated";
  }
}
