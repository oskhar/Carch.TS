import { Request, Response, NextFunction } from "express";
import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";

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

  return res.build(errors, statusCode);
}
