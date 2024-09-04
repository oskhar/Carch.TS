import { PGCategoriesDataSource } from "../../../infrastructure/data-sources/pg/pg-category-data-source";
import { SQLDatabaseWrapper } from "../../../infrastructure/interfaces/database/sql-database-wrapper";
import { CategoriesRepositoryImpl } from "../../../domain/repositories/categories-repository";
import { CategoriesUseCaseImpl } from "../../../domain/use-case/categories-use-case";
import { CategoriesRouter } from "./categories-router";
import { Sequelize } from "sequelize";
import { SequelizeCategoriesDataSource } from "../../../infrastructure/data-sources/sequelize/sequelize-category-data-source";

export default function bundledRouter(db: Sequelize) {
  return [
    CategoriesRouter(
      new CategoriesUseCaseImpl(
        new CategoriesRepositoryImpl(new SequelizeCategoriesDataSource(db))
      )
    ),
  ];
}
