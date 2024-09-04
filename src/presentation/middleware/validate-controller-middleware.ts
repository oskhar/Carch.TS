import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequest } from "@/errors/exceptions/bad-request";

export function validateController(target: any) {
  return new Proxy(target, {
    get(target: any, propertyKey: string) {
      const originalMethod = target[propertyKey];

      if (typeof originalMethod === "function") {
        const querySchemaKey = `queryValidation${capitalizeFirstLetter(
          propertyKey
        )}`;
        const bodySchemaKey = `bodyValidation${capitalizeFirstLetter(
          propertyKey
        )}`;

        const queryValidationSchema: ZodSchema | undefined =
          target[querySchemaKey];
        const bodyValidationSchema: ZodSchema | undefined =
          target[bodySchemaKey];

        return async function (
          req: Request,
          res: Response,
          next: NextFunction
        ) {
          try {
            if (queryValidationSchema) {
              req.query = queryValidationSchema.parse(req.query);
            }
            if (bodyValidationSchema) {
              req.body = bodyValidationSchema.parse(req.body);
            }
            return await originalMethod.apply(target, [req, res, next]);
          } catch (err) {
            if (err instanceof ZodError) {
              const errorMessages = err.errors.map(
                (error: any) => error.path.join(".") + ": " + error.message
              );
              next(new BadRequest("", undefined, errorMessages));
            } else {
              next(err);
            }
          }
        };
      }

      return originalMethod;
    },
  });
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
