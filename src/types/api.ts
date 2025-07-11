// types/api.ts
export interface PaginatedResponse<T> {
    items: T[];
    total_items: number;
    page: number;
    limit: number;
    total_pages: number;
  }
  
  export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
  }