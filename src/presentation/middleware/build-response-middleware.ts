import { Request, Response, NextFunction } from "express";
import { BuildResponseApi } from "../../infrastructure/utils/build-response-api";
import { ApiStatusEnum } from "../enums/api-status-enum";

export function buildResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.build = <T>(payload?: T, status: number = ApiStatusEnum.SUCCESS) => {
    const buildResponseApi = new BuildResponseApi(req, res);

    if (Object.values(ApiStatusEnum).includes(payload as number))
      return buildResponseApi.execute(undefined, payload as ApiStatusEnum);

    if (typeof payload === "string")
      return buildResponseApi.execute(undefined, status, undefined, payload);

    if (Array.isArray(payload))
      return buildResponseApi.execute(undefined, status, payload);

    return buildResponseApi.execute(
      payload !== null ? payload : undefined,
      status
    );
  };
  next();
}

declare global {
  namespace Express {
    interface Response {
      build: <T>(payload?: T, status?: number) => Response;
    }
  }
}
