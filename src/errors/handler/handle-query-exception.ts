import { QueryException } from "../exceptions/query-exception";

export function handleQueryException<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target: any, prop, receiver) {
      const origMethod = target[prop];

      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          try {
            /***/
            return await origMethod.apply(target, args);
            /***/
          } catch (error: any) {
            /***/
            if (error.name === "error")
              throw new QueryException(
                `In method ${prop as string} within class ${
                  target.constructor.name
                }\n${error.message}`
              );

            /**
             * Pass exception
             */
            throw error;
            /***/
          }
        };
      }

      return origMethod;
    },
  });
}
