import express from "express";
import { Request, Response } from "express";
import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";
import { GetAllCategory } from "../../domain/use-case/category/get-all-category";
import { CategoryResponseModel } from "../../domain/models/category";
import { buildPagination } from "../utils/build-pagination";
import { Pagination } from "../../data/APIs/type/api-pagination";
import { validateRequest } from "../middleware/validate-request";
import Joi from "joi";
import { ApiSimpleFilter } from "../../data/APIs/type/api-simple-filter";
import { ApiSimpleSortEnum } from "../../data/APIs/enums/api-simple-sort-enum";
// import { CreateCategory } from "../../domain/use-case/category/create-category";
// import { UpdateCategory } from "../../domain/use-case/category/update-category";
// import { DeleteCategory } from "../../domain/use-case/category/delete-category";

const BASE_URL = "category";
export class CategoryRouter {
  private router = express.Router();

  constructor(
    private getAllCategory: GetAllCategory // protected createCategory: CreateCategory, // protected updateCategory: UpdateCategory, // protected deleteCategory: DeleteCategory
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
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
      this.getAllController.bind(this)
    );

    this.router.post(`/${BASE_URL}/`, this.createController.bind(this));
    this.router.put(`/${BASE_URL}/:id`, this.updateController.bind(this));
    this.router.delete(`/${BASE_URL}/:id`, this.deleteController.bind(this));
  }

  private async getAllController(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10);
      const length = parseInt(req.query.length as string, 10);
      const filter: ApiSimpleFilter = {
        page,
        length,
        search: req.query.search as string,
        sort: req.query.sort as ApiSimpleSortEnum,
      };

      const categories = await this.getAllCategory.execute(filter);

      const totalPages = Math.ceil(categories.total / length);

      return res.build<{
        category: CategoryResponseModel[];
        pagination: Pagination;
      }>(
        {
          category: categories.items,
          pagination: buildPagination(
            page,
            length,
            categories.total,
            totalPages
          ),
        },
        ApiStatusEnum.SUCCESS
      );
    } catch (errors) {
      return res.build(
        [`get ${BASE_URL} error`, errors.message],
        ApiStatusEnum.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createController(req: Request, res: Response) {
    try {
      throw new Error("Router not implemented.");
    } catch (errors) {
      return res.build(
        [`post ${BASE_URL} error`, errors.message],
        ApiStatusEnum.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async updateController(req: Request, res: Response) {
    try {
      throw new Error("Router not implemented.");
    } catch (errors) {
      return res.build(
        [`put ${BASE_URL} error`, errors.message],
        ApiStatusEnum.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async deleteController(req: Request, res: Response) {
    try {
      throw new Error("Router not implemented.");
    } catch (errors) {
      return res.build(
        [`delete ${BASE_URL} error`, errors.message],
        ApiStatusEnum.INTERNAL_SERVER_ERROR
      );
    }
  }

  public getRouter() {
    return this.router;
  }
}
