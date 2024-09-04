import { NotFound } from "@/errors/exceptions/not-found";
import { Request, Response, NextFunction } from "express";

export function checkRouterImplementedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const routeImplemented = false;

  if (!routeImplemented) {
    return next(
      new NotFound(
        `Router not implemented for ${req.method} ${req.originalUrl}`
      )
    );
  }

  next();
}
