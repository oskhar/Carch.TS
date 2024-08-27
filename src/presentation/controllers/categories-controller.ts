import { Request, Response } from "express";
import { CategoriesResponseModel } from "../../domain/models/categories";
import { buildPagination } from "../../utils/build-pagination";
import { Pagination } from "../../data/type/api-pagination";
import { ApiSimpleFilter } from "../../data/type/api-simple-filter";
import { ApiSimpleSortEnum } from "../../data/enums/api-simple-sort-enum";
import { CategoriesUseCase } from "../../domain/interfaces/use-case/categories-use-case";
import { ApiStatusEnum } from "../../data/enums/api-status-enum";
import { RouterNotImplemented } from "../../errors/exceptions/router-nor-implemented";
import { wrapAsyncHandler } from "../../errors/handler/wrap-async-handler";

export class CategoriesController {
  constructor(private categoriesUseCase: CategoriesUseCase) {
    return wrapAsyncHandler(this);
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

  public create = async (req: Request, res: Response) => {
    await this.categoriesUseCase.createOne({ name: req.body.name });
    return res.build(ApiStatusEnum.CREATED);
  };

  public update = async (req: Request, res: Response) => {
    throw new RouterNotImplemented("categories update not implemented.");
  };

  public delete = async (req: Request, res: Response) => {
    await this.categoriesUseCase.deleteOne(req.params.id);
    return res.build(ApiStatusEnum.NO_CONTENT);
  };
}
