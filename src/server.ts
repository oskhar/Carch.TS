import express, { NextFunction } from "express";
import { inspect } from "util";
import { buildResponseMiddleware } from "./presentation/middleware/build-response-middleware";
import { requestIdMiddleware } from "./presentation/middleware/request-id-middleware";
import { exceptionsRender } from "./errors/handler/exceptions-render";
import { checkRouterImplementedMiddleware } from "./presentation/middleware/check-router-implemented-middleware";
import logger from "./errors/logs/logger";
import bundledRouter from "./presentation/routers/v1/all-router-bundle-v1";
import { asyncHandler } from "./infrastructure/utils/async-hendler";
import { Sequelize } from "sequelize";

export async function startServer(db: Sequelize) {
  /**
   * Server configure
   *
   */
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  /**
   * Middleware
   *
   */
  server.use(requestIdMiddleware);
  server.use(buildResponseMiddleware);

  /**
   * Router
   *
   */
  for (const router of bundledRouter(db)) server.use("/api/v1", router);

  /**
   * Async handler
   */
  server._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      middleware.route.stack.forEach((handler: any) => {
        handler.handle = asyncHandler(handler.handle);
      });
    }
  });

  /**
   * Exception
   *
   */
  server.use(checkRouterImplementedMiddleware);
  server.use(exceptionsRender);

  /**
   * Start Server
   *
   */
  const PORT = process.env.APP_PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  /**
   * You can add additional logic to restart the server or handle the error gracefully.
   *
   */
  process.on("unhandledRejection", (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${inspect(promise)} reason: ${reason}`
    );
  });

  /**
   * Anda bisa menambahkan logika tambahan untuk restart server atau handle error secara graceful
   *
   */
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  });
}
