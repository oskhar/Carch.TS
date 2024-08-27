import { Request, Response, NextFunction } from "express";
import { Unauthenticated } from "../../errors/exceptions/unauthenticated";

export function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization)
    throw new Unauthenticated("Missing access token");

  const [, token] = req.headers.authorization.split(/\s+/);
}
