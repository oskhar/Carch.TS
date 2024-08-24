import { Request, Response } from "express";
import {
  ApiStatusEnum,
  ApiStatusMessages,
} from "../../data/APIs/enums/api-status-enum";
import { ApiResponse } from "../../data/APIs/type/api-response";
import { ApiMeta } from "../../data/APIs/type/api-meta";
import { ApiResponseError } from "../../data/APIs/type/api-response-error";
import { generateUUIDv4 } from "./generate-uuid-v4";

export class BuildResponseApi {
  constructor(private req: Request, private res: Response) {}

  execute<T>(
    data?: T,
    status: ApiStatusEnum = ApiStatusEnum.SUCCESS,
    errors?: string[],
    message?: string
  ): Response<ApiResponse<T> | ApiResponseError> {
    const meta: ApiMeta = {
      request_id: this.req.header("X-Request-ID") || generateUUIDv4(),
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
