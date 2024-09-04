import {
  LinkPagination,
  Pagination,
  PaginationParams,
} from "../../presentation/api/type/api-pagination";
import { NotFound } from "../../errors/exceptions/not-found";

export function buildPagination(params: PaginationParams): Pagination {
  if (params.currentPage > params.totalPages && params.totalPages > 0)
    throw new NotFound(
      "You have exceeded the maximum page limit. Please check the available pages and try again."
    );

  const buildQueryString = (page: number) => {
    let queryString = `?page=${page}&length=${params.perPage}`;
    if (params.currentSearch) {
      queryString += `&search=${encodeURIComponent(params.currentSearch)}`;
    }
    return queryString;
  };

  const links: LinkPagination = {
    first: buildQueryString(1),
    last: buildQueryString(params.totalPages),
    next:
      params.currentPage < params.totalPages
        ? buildQueryString(params.currentPage + 1)
        : undefined,
    prev:
      params.currentPage > 1
        ? buildQueryString(params.currentPage - 1)
        : undefined,
  };

  return {
    total: params.totalItems,
    per_page: params.perPage,
    current_page: params.currentPage,
    total_page: params.totalPages,
    links,
  };
}
