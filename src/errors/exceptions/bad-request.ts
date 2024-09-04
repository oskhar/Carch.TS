import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class BadRequest extends Error {
  public readonly statusCode = ApiStatusEnum.BAD_REQUEST;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "BadRequest";
  }
}
