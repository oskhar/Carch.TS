import { RequestHandler } from "express";
import { asyncHandler } from "../../infrastructure/utils/async-hendler";

export function wrapAsyncHandler<T extends object>(controller: T): T {
  return new Proxy(controller, {
    get(target: any, prop, receiver) {
      const value = target[prop as keyof T];

      if (typeof value === "function")
        return asyncHandler(value as RequestHandler);

      return value;
    },
  });
}
