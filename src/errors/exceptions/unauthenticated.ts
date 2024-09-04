import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";

export class Unauthenticated extends Error {
  public readonly statusCode = ApiStatusEnum.UNAUTHORIZED;
  constructor(
    public readonly message: string,
    public readonly description?: string,
    public readonly multiErrors?: string[]
  ) {
    super(message);
    this.name = "Unauthenticated";
  }
}
