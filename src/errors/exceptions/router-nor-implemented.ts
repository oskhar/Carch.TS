import { ApiStatusEnum } from "../../data/enums/api-status-enum";

export class RouterNotImplemented extends Error {
  readonly statusCode = ApiStatusEnum.NOT_FOUND;
  readonly description = "Missing Endpoint.";
  constructor(message: string) {
    super(message);
    this.name = "RouterNotImplemented";
  }
}
