import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { BadRequest } from "../../errors/exceptions/bad-request";

export function validateBodyMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map(
          (error: any) => error.path.join(".") + ": " + error.message
        );

        throw new BadRequest("", undefined, errorMessages);
      }

      throw new err();
    }
  };
}
