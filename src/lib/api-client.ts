//src/lib/api-client.ts - Updated with server-side cookie support
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
        // Try to get token from client-side storage only
        let token: string | null = null;

        // Only try client-side storage (for client-side requests)
        if (typeof window !== 'undefined') {
          token = getToken();
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug log
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          hasAuth: !!token,
          token: token ? `${token.substring(0, 10)}...` : 'none',
          isServer: typeof window === 'undefined'
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response Success:', {
          status: response.status,
          url: response.config.url,
          dataType: typeof response.data
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('API Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          isServer: typeof window === 'undefined'
        });

        // Handle 401 specifically (only on client-side)
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          console.log(
            '401 Unauthorized - Removing token and redirecting to login'
          );
          removeToken();
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
      }
    );
  }

  // Create a server-side client with explicit token
  static createServerClient(token: string): ApiClient {
    const client = new ApiClient();

    // Override the default interceptor for server-side usage
    client.client.interceptors.request.clear();
    client.client.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;

        console.log('Server API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          hasAuth: !!token,
          token: token ? `${token.substring(0, 10)}...` : 'none'
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    return client;
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<T> {
    return response.data;
  }

  private async handleError(error: AxiosError): Promise<never> {
    let message = 'An error occurred';

    if (error.response?.data) {
      const errorData = error.response.data as any;
      message = errorData.error || errorData.message || error.message;
    } else if (error.message) {
      message = error.message;
    }

    // Add more context for specific errors
    if (error.response?.status === 401) {
      message = 'Authentication required. Please log in.';
    } else if (error.response?.status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (error.response?.status === 404) {
      message = 'Resource not found.';
    } else if (error.response?.status >= 500) {
      message = 'Server error. Please try again later.';
    }

    console.error('API Error Details:', {
      status: error.response?.status,
      message,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      isServer: typeof window === 'undefined'
    });

    throw new Error(message);
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log(
        'Attempting login to:',
        `${this.client.defaults.baseURL}/auth/login`
      );
      const response = await this.client.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      console.log('Login successful, received token');
      return this.handleResponse(response);
    } catch (error) {
      console.error('Login failed:', error);
      return this.handleError(error as AxiosError);
    }
  }

  // Test connection method
  async testConnection(): Promise<any> {
    try {
      const response = await this.client.get('/health');
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
      console.log('Getting samples with filters:', filters);
      const response = await this.client.get<PaginatedResponse<SampleProduct>>(
        '/samples',
        {
          params: filters
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('getSamples failed:', error);
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
      const response =
        await this.client.get<ProductNameResponse[]>('/product-names');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}

// Export singleton instance for client-side
export const apiClient = new ApiClient();

// Export class for server-side usage with explicit token
export { ApiClient };
export default apiClient;
