import { Request, Response, NextFunction } from "express";
import { ApiStatusEnum } from "../../data/enums/api-status-enum";
import logger from "../logs/logger";

export function exceptionsRender(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || ApiStatusEnum.INTERNAL_SERVER_ERROR;
  let errors = [err.name];

  if (err.description) errors = [...errors];

  errors = [
    ...errors,
    ...(err.multiErrors ? err.multiErrors : err.message.split("\n")),
  ];

  logger.error(`\n(${statusCode}) X-Request-ID["${
    req.headers["X-Request-ID"]
  }"]: ${errors.join("\n")}
    \nendpoint: ${req.originalUrl}
    \nheader: ${JSON.stringify(req.headers, null, 2)}
    \nquery: ${JSON.stringify(req.query, null, 2)}
    \nbody: ${JSON.stringify(req.body, null, 2)}
    `);

  return res.build(errors, statusCode);
}
