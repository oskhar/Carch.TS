export type LinkPagination = {
  next?: string;
  prev?: string;
  first: string;
  last: string;
};

export type Pagination = {
  total: number;
  per_page: number;
  current_page: number;
  total_page: number;
  links: LinkPagination;
};

export type ApiPagination<T> = {
  data: T;
  pagination: Pagination;
};
