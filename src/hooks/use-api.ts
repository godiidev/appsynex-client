//src/hooks/use-api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import type {
  SampleProduct,
  SampleFilterParams,
  CreateSampleRequest,
  UpdateSampleRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '@/types/api';

// Samples hooks
export function useSamples(filters?: SampleFilterParams) {
  return useQuery({
    queryKey: ['samples', filters],
    queryFn: () => apiClient.getSamples(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useSample(id: number) {
  return useQuery({
    queryKey: ['samples', id],
    queryFn: () => apiClient.getSample(id),
    enabled: !!id
  });
}

export function useCreateSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sample: CreateSampleRequest) => apiClient.createSample(sample),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      toast.success('Tạo mẫu vải thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo mẫu vải: ${error.message}`);
    }
  });
}

export function useUpdateSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...sample }: UpdateSampleRequest & { id: number }) =>
      apiClient.updateSample(id, sample),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      queryClient.invalidateQueries({ queryKey: ['samples', variables.id] });
      toast.success('Cập nhật mẫu vải thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật mẫu vải: ${error.message}`);
    }
  });
}

export function useDeleteSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteSample(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      toast.success('Xóa mẫu vải thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa mẫu vải: ${error.message}`);
    }
  });
}

// Users hooks
export function useUsers(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => apiClient.getUsers(page, limit, search),
    staleTime: 5 * 60 * 1000
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.getUser(id),
    enabled: !!id
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUserRequest) => apiClient.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Tạo người dùng thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo người dùng: ${error.message}`);
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...user }: UpdateUserRequest & { id: number }) =>
      apiClient.updateUser(id, user),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      toast.success('Cập nhật người dùng thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Xóa người dùng thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa người dùng: ${error.message}`);
    }
  });
}

// Categories hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CreateCategoryRequest) =>
      apiClient.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Tạo danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo danh mục: ${error.message}`);
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...category }: UpdateCategoryRequest & { id: number }) =>
      apiClient.updateCategory(id, category),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
      toast.success('Cập nhật danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật danh mục: ${error.message}`);
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Xóa danh mục thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa danh mục: ${error.message}`);
    }
  });
}

// Product Names hook (for dropdowns)
export function useProductNames() {
  return useQuery({
    queryKey: ['product-names'],
    queryFn: () => apiClient.getProductNames(),
    staleTime: 30 * 60 * 1000 // 30 minutes
  });
}
