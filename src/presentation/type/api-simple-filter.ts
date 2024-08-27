import { ApiSimpleSortEnum } from "../enums/api-simple-sort-enum";

export type ApiSimpleFilter = {
  page: number;
  perPage: number;
  search: string;
  sort: ApiSimpleSortEnum;
};
