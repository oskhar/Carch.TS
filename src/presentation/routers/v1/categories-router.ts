import express from "express";
import { validateQueryMiddleware } from "../../middleware/validate-query-middleware";
import z from "zod";
import { CategoriesUseCase } from "../../../domain/interfaces/use-case/categories-use-case";
import { asyncHandler } from "../../../infrastructure/utils/async-hendler";
import { CategoriesController } from "../../controllers/categories-controller";
import { validateBodyMiddleware } from "../../middleware/validate-body-middleware";

export function CategoriesRouter(categoriesUseCase: CategoriesUseCase) {
  /**
   * router configure
   */
  const baseUrl = "categories";
  const router = express.Router();
  const controller = new CategoriesController(categoriesUseCase);

  /**
   * define router GET & POST categories
   */
  router.route(`/${baseUrl}/`).get(controller.getAll).post(controller.create);

  /**
   * define router PUT & DELETE categories with param
   */
  router
    .route(`/${baseUrl}/:id`)
    .get(controller.getOne)
    .put(controller.update)
    .delete(controller.delete);

  /**
   * bouncing defined router
   */
  return router;
}
