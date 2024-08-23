import express from "express";
import { SQLDatabaseWrapper } from "./data/interfaces/database/sql-database-wrapper";
import { CategoriesRouter } from "./presentation/routers/categories-router";
import { GetAllCategories } from "./domain/use-case/categories/get-all-categories";
import { CategoriesRepositoryImpl } from "./domain/repositories/categories-repository";
import { PGCategoriesDataSource } from "./data/data-sources/pg/pg-category-data-source";
import { buildResponseMiddleware } from "./presentation/middleware/build-response-middleware";
import { requestIdMiddleware } from "./presentation/middleware/request-id-middleware";

export async function startServer(db: SQLDatabaseWrapper) {
  const server = express();
  server.use(express.json());

  // Middleware
  server.use(buildResponseMiddleware);
  server.use(requestIdMiddleware);

  // Router
  const categoryRouter = new CategoriesRouter(
    new GetAllCategories(
      new CategoriesRepositoryImpl(new PGCategoriesDataSource(db))
    )
  );
  server.use(categoryRouter.getRouter());

  // Start server
  const PORT = process.env.APP_PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
