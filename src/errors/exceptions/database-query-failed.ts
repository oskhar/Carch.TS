import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class InternalServerError extends Error {
  public readonly statusCode = ApiStatusEnum.INTERNAL_SERVER_ERROR;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "InternalServerError";
  }
}
