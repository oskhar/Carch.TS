import { ApiMeta } from "./api-meta";

export type ApiResponse<T = undefined> = T extends undefined
  ? {
      status: boolean;
      message: string;
      meta: ApiMeta;
    }
  : {
      status: boolean;
      message: string;
      data: T;
      meta: ApiMeta;
    };
