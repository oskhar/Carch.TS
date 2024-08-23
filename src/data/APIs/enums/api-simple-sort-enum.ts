export enum ApiSimpleSortEnum {
  LATEST = "latest",
  OLDEST = "oldest",
  AZ = "a-z",
  ZA = "z-a",
}

export interface SortOption {
  column: string;
  direction: "ASC" | "DESC";
}

export function getSortOption(sort: ApiSimpleSortEnum): SortOption {
  switch (sort) {
    case ApiSimpleSortEnum.AZ:
      return { column: "name", direction: "ASC" };
    case ApiSimpleSortEnum.ZA:
      return { column: "name", direction: "DESC" };
    case ApiSimpleSortEnum.LATEST:
      return { column: "created_date", direction: "DESC" };
    case ApiSimpleSortEnum.OLDEST:
      return { column: "created_date", direction: "ASC" };
    default:
      throw new Error(`Unsupported sort type: ${sort}`);
  }
}
