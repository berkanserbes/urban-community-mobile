export interface ApiResponse<T> {
  data: T | null;
  isSuccess: boolean;
  errors?: string[];
}

/** Mirrors the backend PagedResult<T>. pageIndex is 1-based. */
export interface PagedResult<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageIndex?: number;
  pageSize?: number;
}
