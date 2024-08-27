import { Request, Response } from "express";
import {
  ApiStatusEnum,
  ApiStatusMessages,
} from "../data/enums/api-status-enum";
import { ApiResponse } from "../data/type/api-response";
import { ApiMeta } from "../data/type/api-meta";
import { ApiResponseError } from "../data/type/api-response-error";
import { generateUUIDv4 } from "./generate-uuid-v4";

export class BuildResponseApi {
  constructor(private readonly req: Request, private readonly res: Response) {}

  execute<T>(
    data?: T,
    status: ApiStatusEnum = ApiStatusEnum.SUCCESS,
    errors?: string[],
    message?: string
  ): Response<ApiResponse<T> | ApiResponseError> {
    const meta: ApiMeta = {
      request_id:
        (this.req.headers["X-Request-ID"] as string) || generateUUIDv4(),
      response_size: "0 Byte",
    };

    let response: any;

    if (errors && errors.length > 0) {
      response = {
        status: false,
        message: message || ApiStatusMessages[status],
        errors,
        meta,
      } as ApiResponseError;
    } else if (data !== undefined) {
      response = {
        status: true,
        message: message || ApiStatusMessages[status],
        data,
        meta,
      } as ApiResponse<T>;
    } else {
      response = {
        status: true,
        message: message || ApiStatusMessages[status],
        meta,
      };
    }

    response.meta.response_size =
      Buffer.byteLength(JSON.stringify(response)) + " Byte";

    return this.res.status(status).json(response);
  }
}
