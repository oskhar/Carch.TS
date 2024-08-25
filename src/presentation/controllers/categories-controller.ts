import { Request, Response } from "express";
import { CategoriesResponseModel } from "../../domain/models/categories";
import { buildPagination } from "../../utils/build-pagination";
import { Pagination } from "../../data/APIs/type/api-pagination";
import { ApiSimpleFilter } from "../../data/APIs/type/api-simple-filter";
import { ApiSimpleSortEnum } from "../../data/APIs/enums/api-simple-sort-enum";
import { CategoriesUseCase } from "../../domain/interfaces/use-case/categories-use-case";
import { ApiStatusEnum } from "../../data/APIs/enums/api-status-enum";

export class CategoriesController {
  constructor(private categoriesUseCase: CategoriesUseCase) {}

  public getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const length = parseInt(req.query.length as string);
    const filter: ApiSimpleFilter = {
      page,
      length,
      search: req.query.search as string,
      sort: req.query.sort as ApiSimpleSortEnum,
    };
    const categories = await this.categoriesUseCase.getCategories(filter);
    const totalPages = Math.ceil(categories.total / length);

    return res.build<{
      categories: CategoriesResponseModel[];
      pagination: Pagination;
    }>({
      categories: categories.items,
      pagination: buildPagination(
        page,
        length,
        categories.total,
        totalPages,
        filter.search
      ),
    });
  };

  public create = async (req: Request, res: Response) => {
    await this.categoriesUseCase.createOne({ name: req.body.name });
    return res.build(ApiStatusEnum.CREATED);
  };

  public update = async (req: Request, res: Response) => {
    throw new Error("Router not implemented.");
  };

  public delete = async (req: Request, res: Response) => {
    await this.categoriesUseCase.deleteOne(req.params.id);
    return res.build(ApiStatusEnum.NO_CONTENT);
  };
}
