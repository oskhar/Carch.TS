import { ApiStatusEnum } from "../../data/enums/api-status-enum";

export class ConflictUniqueData extends Error {
  readonly statusCode = ApiStatusEnum.CONFLICT;
  readonly description = "Attempted to add a duplicate unique value.";
  constructor(message: string) {
    super(message);
    this.name = "ConflictUniqueData";
  }
}
