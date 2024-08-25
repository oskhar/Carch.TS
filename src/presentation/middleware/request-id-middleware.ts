import { Request, Response, NextFunction } from "express";
import { generateUUIDv4 } from "../../utils/generate-uuid-v4";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.headers["X-Request-ID"] = req.header("X-Request-ID") || generateUUIDv4();
  next();
}
