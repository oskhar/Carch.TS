import { ApiSimpleSortEnum } from "../enums/api-simple-sort-enum";

export type ApiSimpleFilter = {
  page: number;
  length: number;
  search: string;
  sort: ApiSimpleSortEnum;
};
