import { DatabaseQueryFailed } from "../exceptions/database-query-failed";

export function wrapRepositoryException<T extends object>(repository: T): T {
  return new Proxy(repository, {
    get(repository: any, prop, receiver) {
      const origMethod = repository[prop];

      if (typeof origMethod === "function") {
        return async (...args: any[]) => {
          try {
            /***/
            return await origMethod.apply(repository, args);
            /***/
          } catch (error: any) {
            /***/
            if (error.name === "error")
              throw new DatabaseQueryFailed(
                `In method ${prop as string} within class ${
                  repository.constructor.name
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
