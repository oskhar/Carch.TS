import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";
import { InvalidRequest } from "../../errors/exceptions/invalid-request";

export function validateRequest(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const source = req.method === "GET" ? "query" : "body";
    const data = source === "body" ? req.body : req.query;

    const { error, value } = schema.validate(data, {
      allowUnknown: true,
      abortEarly: false,
    });

    if (error) {
      throw new InvalidRequest(error.details.map((detail) => detail.message));
    }

    if (source === "body") {
      req.body = value;
    } else {
      req.query = value;
    }

    next();
  };
}
