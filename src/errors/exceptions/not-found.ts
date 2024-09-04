import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class NotFound extends Error {
  public readonly statusCode = ApiStatusEnum.NOT_FOUND;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "NotFound";
  }
}
