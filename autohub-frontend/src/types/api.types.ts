export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  content?: T[];
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiError {
  errorCode: string;
  errorMessage: string;
  details?: Record<string, string>;
  timestamp: string;
}
