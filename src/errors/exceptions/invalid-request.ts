import { ApiStatusEnum } from "../../data/enums/api-status-enum";

export class InvalidRequest extends Error {
  readonly statusCode = ApiStatusEnum.BAD_REQUEST;
  readonly description = "The data entered is incorrect.";
  constructor(readonly multiErrors: string[]) {
    super("Message in details");
    this.name = "InvalidRequest";
  }
}
