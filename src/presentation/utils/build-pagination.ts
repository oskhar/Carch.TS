import {
  LinkPagination,
  Pagination,
} from "../../data/APIs/type/api-pagination";

export function buildPagination(
  currentPage: number,
  perPage: number,
  totalItems: number,
  totalPages: number
): Pagination {
  const links: LinkPagination = {
    first: `?page=1&per_page=${perPage}`,
    last: `?page=${totalPages}&per_page=${perPage}`,
    next:
      currentPage < totalPages
        ? `?page=${currentPage + 1}&per_page=${perPage}`
        : undefined,
    prev:
      currentPage > 1
        ? `?page=${currentPage - 1}&per_page=${perPage}`
        : undefined,
  };

  return {
    total: totalItems,
    per_page: perPage,
    current_page: currentPage,
    total_page: totalPages,
    links,
  };
}
