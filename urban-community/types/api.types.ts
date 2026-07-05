export interface ApiResponse<T> {
  data: T | null;
  isSuccess: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
