import { ApiResponse } from "./api-response";

export type ApiResponseError = ApiResponse & {
  errors: string[];
};
