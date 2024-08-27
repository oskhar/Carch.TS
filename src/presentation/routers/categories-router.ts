import express from "express";
import { validateRequestMiddleware } from "../middleware/validate-request-middleware";
import Joi from "joi";
import { CategoriesUseCase } from "../../domain/interfaces/use-case/categories-use-case";
import { asyncHandler } from "../../utils/async-hendler";
import { CategoriesController } from "../controllers/categories-controller";

export function CategoriesRouter(categoriesUseCase: CategoriesUseCase) {
  /**
   * router configure
   */
  const baseUrl = "categories";
  const router = express.Router();
  const controller = new CategoriesController(categoriesUseCase);

  /**
   * validation schema
   */
  const getPaginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).optional(),
    per_page: Joi.number().integer().min(1).default(10).optional(),
    search: Joi.string().optional().allow(""),
    sort: Joi.string()
      .valid("latest", "oldest", "a-z", "z-a")
      .default("latest")
      .optional(),
  });
  const createUpdateSchema = Joi.object({
    name: Joi.string().min(2).required(),
  });

  /**
   * define router GET & POST categories
   */
  router
    .route(`/${baseUrl}/`)
    .get(validateRequestMiddleware(getPaginationSchema), controller.getAll)
    .post(validateRequestMiddleware(createUpdateSchema), controller.create);

  /**
   * define router PUT & DELETE categories with param
   */
  router
    .route(`/${baseUrl}/:id`)
    .put(validateRequestMiddleware(createUpdateSchema), controller.update)
    .delete(controller.delete);

  /**
   * bouncing defined router
   */
  return router;
}
