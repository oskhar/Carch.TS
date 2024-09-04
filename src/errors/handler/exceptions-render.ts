import { Request, Response, NextFunction } from "express";
import { ApiStatusEnum } from "../../presentation/api/enums/api-status-enum";
import logger from "../logs/logger";

export function exceptionsRender(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode: ApiStatusEnum =
    err.statusCode || ApiStatusEnum.INTERNAL_SERVER_ERROR;

  let errors: string[] = [
    ...(err.multiErrors ? err.multiErrors : err.message.split("\n")),
  ];

  if (statusCode == ApiStatusEnum.INTERNAL_SERVER_ERROR) {
    logger.error(`${errors.join(" ||| ")}
    \nendpoint: ${req.originalUrl}
    \nheader: ${JSON.stringify(req.headers, null, 2)}
    \nquery: ${JSON.stringify(req.query, null, 2)}
    \nbody: ${JSON.stringify(req.body, null, 2)}
    `);

    if (process.env.APP_DEBUG != "true") errors = ["undefined error"];
  }

  return res.build(errors, statusCode);
}
