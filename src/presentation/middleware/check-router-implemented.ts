import { Request, Response, NextFunction } from "express";
import { RouterNotImplemented } from "../../errors/exceptions/router-nor-implemented";

export function checkRouterImplemented(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const routeImplemented = false;

  if (!routeImplemented) {
    return next(
      new RouterNotImplemented(
        `Router not implemented for ${req.method} ${req.originalUrl}`
      )
    );
  }

  next();
}
