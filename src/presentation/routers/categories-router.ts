import express from "express";
import { validateRequest } from "../middleware/validate-request";
import Joi from "joi";
import { CategoriesUseCase } from "../../domain/interfaces/use-case/categories-use-case";
import { asyncHandler } from "../middleware/async-hendler";
import { CategoriesController } from "../controllers/categories-controller";

export function CategoriesRouter(categoriesUseCase: CategoriesUseCase) {
  const BASE_URL = "categories";
  const router = express.Router();
  const controller = new CategoriesController(categoriesUseCase);

  /**
   * define endpoint GET `categories`
   */
  router.get(
    `/${BASE_URL}/`,
    validateRequest(
      Joi.object({
        page: Joi.number().integer().min(1).default(1).optional(),
        length: Joi.number().integer().min(1).default(10).optional(),
        search: Joi.string().optional().allow(""),
        sort: Joi.string()
          .valid("latest", "oldest", "a-z", "z-a")
          .default("latest")
          .optional(),
      })
    ),
    asyncHandler(controller.getAll)
  );

  /**
   * define endpoint POST `categories`
   */
  router.post(
    `/${BASE_URL}/`,
    validateRequest(
      Joi.object({
        name: Joi.string().min(2).required(),
      })
    ),
    asyncHandler(controller.create)
  );

  /**
   * define endpoint PUT `categories/{id}`
   */
  router.put(`/${BASE_URL}/:id`, asyncHandler(controller.update));

  /**
   * define endpoint DELETE `categories/{id}`
   */
  router.delete(`/${BASE_URL}/:id`, asyncHandler(controller.delete));

  return router;
}
