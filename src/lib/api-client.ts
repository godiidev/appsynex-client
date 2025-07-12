import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getToken, removeToken } from './storage';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  SampleProduct,
  SampleFilterParams,
  CreateSampleRequest,
  UpdateSampleRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ProductNameResponse
} from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/sign-in';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<T> {
    return response.data;
  }

  private async handleError(error: AxiosError): Promise<never> {
    const message = (error.response?.data as any)?.error || error.message;
    throw new Error(message);
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.client.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Samples API
  async getSamples(
    filters?: SampleFilterParams
  ): Promise<PaginatedResponse<SampleProduct>> {
    try {
      const response = await this.client.get<PaginatedResponse<SampleProduct>>(
        '/samples',
        {
          params: filters
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async getSample(id: number): Promise<SampleProduct> {
    try {
      const response = await this.client.get<SampleProduct>(`/samples/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async createSample(sample: CreateSampleRequest): Promise<SampleProduct> {
    try {
      const response = await this.client.post<SampleProduct>(
        '/samples',
        sample
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async updateSample(
    id: number,
    sample: UpdateSampleRequest
  ): Promise<SampleProduct> {
    try {
      const response = await this.client.put<SampleProduct>(
        `/samples/${id}`,
        sample
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async deleteSample(id: number): Promise<void> {
    try {
      await this.client.delete(`/samples/${id}`);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Users API
  async getUsers(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<User>> {
    try {
      const response = await this.client.get<PaginatedResponse<User>>(
        '/users',
        {
          params: { page, limit, search }
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const response = await this.client.get<User>(`/users/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    try {
      const response = await this.client.post<User>('/users', user);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async updateUser(id: number, user: UpdateUserRequest): Promise<User> {
    try {
      const response = await this.client.put<User>(`/users/${id}`, user);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.client.delete(`/users/${id}`);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Categories API
  async getCategories(): Promise<{
    categories: CategoryResponse[];
    total: number;
  }> {
    try {
      const response = await this.client.get<{
        categories: CategoryResponse[];
        total: number;
      }>('/categories');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async getCategory(id: number): Promise<CategoryResponse> {
    try {
      const response = await this.client.get<CategoryResponse>(
        `/categories/${id}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async createCategory(
    category: CreateCategoryRequest
  ): Promise<CategoryResponse> {
    try {
      const response = await this.client.post<CategoryResponse>(
        '/categories',
        category
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async updateCategory(
    id: number,
    category: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    try {
      const response = await this.client.put<CategoryResponse>(
        `/categories/${id}`,
        category
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await this.client.delete(`/categories/${id}`);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Product Names API (for sample form dropdown)
  async getProductNames(): Promise<ProductNameResponse[]> {
    try {
      // Note: This endpoint might need to be added to Go server if not exists
      const response =
        await this.client.get<ProductNameResponse[]>('/product-names');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
