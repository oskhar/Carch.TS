import { Request, Response, NextFunction } from "express";
import { BuildResponseApi } from "../utils/build-response-api";
import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";

export function buildResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.build = <T>(
    payload: T | string[],
    status: number = ApiStatusEnum.SUCCESS
  ) => {
    const buildResponseApi = new BuildResponseApi(req, res);

    if (Array.isArray(payload))
      return buildResponseApi.execute(undefined, status, payload);

    return buildResponseApi.execute(payload, status, undefined);
  };
  next();
}

declare global {
  namespace Express {
    interface Response {
      build: <T>(payload: T | string[], status?: number) => Response;
    }
  }
}
