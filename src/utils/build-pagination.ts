import { LinkPagination, Pagination } from "../data/APIs/type/api-pagination";
import { DataNotFound } from "../errors/exceptions/data-not-found";

export function buildPagination(
  currentPage: number,
  perPage: number,
  totalItems: number,
  totalPages: number,
  currentSearch?: string
): Pagination {
  if (currentPage > totalPages && totalPages > 0)
    throw new DataNotFound(
      "You have exceeded the maximum page limit. Please check the available pages and try again."
    );

  const buildQueryString = (page: number) => {
    let queryString = `?page=${page}&length=${perPage}`;
    if (currentSearch) {
      queryString += `&search=${encodeURIComponent(currentSearch)}`;
    }
    return queryString;
  };

  const links: LinkPagination = {
    first: buildQueryString(1),
    last: buildQueryString(totalPages),
    next:
      currentPage < totalPages ? buildQueryString(currentPage + 1) : undefined,
    prev: currentPage > 1 ? buildQueryString(currentPage - 1) : undefined,
  };

  return {
    total: totalItems,
    per_page: perPage,
    current_page: currentPage,
    total_page: totalPages,
    links,
  };
}
