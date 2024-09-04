import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class Conflict extends Error {
  public readonly statusCode = ApiStatusEnum.CONFLICT;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "Conflict";
  }
}
