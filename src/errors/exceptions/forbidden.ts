import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class Forbidden extends Error {
  public readonly statusCode = ApiStatusEnum.FORBIDDEN;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "Forbidden";
  }
}
