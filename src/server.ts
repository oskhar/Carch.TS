import express from "express";
import { SQLDatabaseWrapper } from "./data/interfaces/database/sql-database-wrapper";
import { CategoryRouter } from "./presentation/routers/category-router";
import { GetAllCategory } from "./domain/use-case/category/get-all-category";
import { CategoryRepositoryImpl } from "./domain/repositories/category-repository";
import { PGCategoryDataSource } from "./data/data-sources/pg/pg-category-data-source";
import { buildResponseMiddleware } from "./presentation/middleware/build-response-middleware";
import { requestIdMiddleware } from "./presentation/middleware/request-id-middleware";

export async function startServer(db: SQLDatabaseWrapper) {
  const server = express();
  server.use(express.json());

  // Middleware
  server.use(buildResponseMiddleware);
  server.use(requestIdMiddleware);

  // Router
  const categoryRouter = new CategoryRouter(
    new GetAllCategory(new CategoryRepositoryImpl(new PGCategoryDataSource(db)))
  );
  server.use(categoryRouter.getRouter());

  // Start server
  const PORT = process.env.APP_PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
