import { PGCategoriesDataSource } from "../../data/data-sources/pg/pg-category-data-source";
import { SQLDatabaseWrapper } from "../../data/interfaces/database/sql-database-wrapper";
import { CategoriesRepositoryImpl } from "../../domain/repositories/categories-repository";
import { CategoriesUseCaseImpl } from "../../domain/use-case/categories-use-case";
import { CategoriesRouter } from "./categories-router";

export default function bundledRouter(db: SQLDatabaseWrapper) {
  return [
    CategoriesRouter(
      new CategoriesUseCaseImpl(
        new CategoriesRepositoryImpl(new PGCategoriesDataSource(db))
      )
    ),
  ];
}
