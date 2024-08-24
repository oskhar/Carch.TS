import {
  LinkPagination,
  Pagination,
} from "../../data/APIs/type/api-pagination";

export function buildPagination(
  currentPage: number,
  perPage: number,
  totalItems: number,
  totalPages: number,
  currentSearch?: string
): Pagination {
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
