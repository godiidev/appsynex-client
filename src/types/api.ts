// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// Sample Types
export interface SampleProduct {
  id: number;
  sku: string;
  product_name_id: number;
  category_id: number;
  description: string;
  sample_type: string;
  weight: number;
  width: number;
  color: string;
  color_code: string;
  quality: string;
  remaining_quantity: number;
  fiber_content: string;
  source: string;
  sample_location: string;
  barcode: string;
  created_at: string;
  updated_at: string;
  product_name?: ProductNameResponse;
  category?: CategoryResponse;
}

export interface ProductNameResponse {
  id: number;
  product_name_vi: string;
  product_name_en: string;
  sku_parent: string;
}

export interface CategoryResponse {
  id: number;
  category_name: string;
  parent_category_id?: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Sample Filters
export interface SampleFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sample_type?: string;
  weight_min?: number;
  weight_max?: number;
  width_min?: number;
  width_max?: number;
  color?: string;
}

// Create/Update Sample
export interface CreateSampleRequest {
  sku: string;
  product_name_id: number;
  category_id: number;
  description?: string;
  sample_type?: string;
  weight?: number;
  width?: number;
  color?: string;
  color_code?: string;
  quality?: string;
  remaining_quantity?: number;
  fiber_content?: string;
  source?: string;
  sample_location?: string;
  barcode?: string;
}

export interface UpdateSampleRequest {
  sku?: string;
  product_name_id?: number;
  category_id?: number;
  description?: string;
  sample_type?: string;
  weight?: number;
  width?: number;
  color?: string;
  color_code?: string;
  quality?: string;
  remaining_quantity?: number;
  fiber_content?: string;
  source?: string;
  sample_location?: string;
  barcode?: string;
}

// User Management
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  last_login?: string;
  account_status: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface Role {
  id: number;
  role_name: string;
  description: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
  role_ids?: number[];
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  account_status?: string;
  role_ids?: number[];
}

// Category Management
export interface CreateCategoryRequest {
  category_name: string;
  parent_category_id?: number;
  description?: string;
}

export interface UpdateCategoryRequest {
  category_name?: string;
  parent_category_id?: number;
  description?: string;
}

// Error Types
export interface ApiError {
  error: string;
  code?: number;
  details?: any;
}
