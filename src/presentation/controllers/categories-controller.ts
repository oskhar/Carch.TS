import { Request, Response } from "express";
import { Pagination } from "../api/type/api-pagination";
import { ApiSimpleFilter } from "../api/type/api-simple-filter";
import { ApiSimpleSortEnum } from "../api/enums/api-simple-sort-enum";
import { ApiStatusEnum } from "../api/enums/api-status-enum";
import z from "zod";
import { validateController } from "../middleware/validate-controller-middleware";
import { CategoriesUseCase } from "@/domain/interfaces/use-case/categories-use-case";
import { wrapAsyncHandler } from "@/errors/handler/wrap-async-handler";
import { buildPagination } from "@/infrastructure/utils/build-pagination";
import { CategoriesResponseModel } from "@/domain/models/categories";

export class CategoriesController {
  constructor(
    private readonly categoriesUseCase: CategoriesUseCase,

    /**
     * Validation schemas
     */
    private readonly queryValidationGetAll = z.object({
      page: z.coerce.number().int().min(1).default(1),
      per_page: z.coerce.number().int().min(1).default(10),
      search: z.string().optional().or(z.literal("")),
      sort: z.enum(["latest", "oldest", "a-z", "z-a"]).default("latest"),
    }),
    private readonly bodyValidationCreate = z.object({
      name: z.string(),
    }),
    private readonly bodyValidationUpdate = z.object({
      name: z.string(),
    })
  ) {
    return validateController(wrapAsyncHandler(this));
  }

  public getAll = async (req: Request, res: Response) => {
    const filter: ApiSimpleFilter = {
      page: parseInt(req.query.page as string),
      perPage: parseInt(req.query.per_page as string),
      search: req.query.search as string,
      sort: req.query.sort as ApiSimpleSortEnum,
    };
    const categories = await this.categoriesUseCase.getCategories(filter);

    const pagination = buildPagination({
      currentPage: filter.page,
      perPage: filter.perPage,
      totalItems: categories.total,
      totalPages: Math.ceil(categories.total / filter.perPage),
      currentSearch: filter.search,
    });

    res.build<{
      categories: CategoriesResponseModel[];
      pagination: Pagination;
    }>({
      categories: categories.items,
      pagination: pagination,
    });
  };

  public getOne = async (req: Request, res: Response) => {
    const result: CategoriesResponseModel = await this.categoriesUseCase.getOne(
      req.params.id
    );

    return res.build<{ categories: CategoriesResponseModel }>({
      categories: result,
    });
  };

  public create = async (req: Request, res: Response) => {
    await this.categoriesUseCase.createOne({ name: req.body.name });
    return res.build(ApiStatusEnum.CREATED);
  };

  public update = async (req: Request, res: Response) => {
    await this.categoriesUseCase.updateOne(req.params.id, {
      name: req.body.name,
    });
    return res.build();
  };

  public delete = async (req: Request, res: Response) => {
    await this.categoriesUseCase.deleteOne(req.params.id);
    return res.build(ApiStatusEnum.NO_CONTENT);
  };
}
