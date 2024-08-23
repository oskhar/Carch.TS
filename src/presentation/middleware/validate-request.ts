import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export function validateRequest(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const source = req.method === "GET" ? "query" : "body";
    const data = source === "body" ? req.body : req.query;

    const { error, value } = schema.validate(data, {
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters",
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (source === "body") {
      req.body = value;
    } else {
      req.query = value;
    }

    next();
  };
}
