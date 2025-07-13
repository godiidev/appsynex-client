import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  category: parseAsString,
  sample_type: parseAsString,
  color: parseAsString,
  weight_min: parseAsInteger,
  weight_max: parseAsInteger,
  width_min: parseAsInteger,
  width_max: parseAsInteger
};

// Create search params cache for server-side parsing
export const searchParamsCache = createSearchParamsCache(searchParams);

// Create serializer for client-side URL generation
export const serialize = createSerializer(searchParams);

// Helper function to build query string from params
export const buildQueryString = (
  params: Partial<Record<keyof typeof searchParams, any>>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

// Helper function to parse query string into typed params
export const parseQueryString = (queryString: string) => {
  const urlParams = new URLSearchParams(queryString);
  const params: Partial<Record<keyof typeof searchParams, any>> = {};

  // Parse each parameter with proper type conversion
  if (urlParams.has('page')) {
    const page = parseInt(urlParams.get('page') || '1');
    params.page = isNaN(page) ? 1 : Math.max(1, page);
  }

  if (urlParams.has('perPage')) {
    const perPage = parseInt(urlParams.get('perPage') || '10');
    params.perPage = isNaN(perPage) ? 10 : Math.max(1, Math.min(100, perPage));
  }

  if (urlParams.has('name')) {
    params.name = urlParams.get('name') || undefined;
  }

  if (urlParams.has('category')) {
    params.category = urlParams.get('category') || undefined;
  }

  if (urlParams.has('sample_type')) {
    params.sample_type = urlParams.get('sample_type') || undefined;
  }

  if (urlParams.has('color')) {
    params.color = urlParams.get('color') || undefined;
  }

  if (urlParams.has('weight_min')) {
    const weightMin = parseInt(urlParams.get('weight_min') || '');
    params.weight_min = isNaN(weightMin) ? undefined : weightMin;
  }

  if (urlParams.has('weight_max')) {
    const weightMax = parseInt(urlParams.get('weight_max') || '');
    params.weight_max = isNaN(weightMax) ? undefined : weightMax;
  }

  if (urlParams.has('width_min')) {
    const widthMin = parseInt(urlParams.get('width_min') || '');
    params.width_min = isNaN(widthMin) ? undefined : widthMin;
  }

  if (urlParams.has('width_max')) {
    const widthMax = parseInt(urlParams.get('width_max') || '');
    params.width_max = isNaN(widthMax) ? undefined : widthMax;
  }

  if (urlParams.has('sort')) {
    params.sort = urlParams.get('sort') || undefined;
  }

  if (urlParams.has('order')) {
    const order = urlParams.get('order');
    params.order = order === 'asc' || order === 'desc' ? order : 'desc';
  }

  return params;
};

// Helper function to merge params with current URL
export const updateSearchParams = (
  currentSearchParams: URLSearchParams,
  updates: Partial<Record<keyof typeof searchParams, any>>
): string => {
  const newParams = new URLSearchParams(currentSearchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value.toString());
    }
  });

  return newParams.toString();
};

// Helper to reset pagination when filters change
export const updateWithPaginationReset = (
  currentSearchParams: URLSearchParams,
  updates: Partial<Record<keyof typeof searchParams, any>>
): string => {
  const updatesWithReset = {
    ...updates,
    page: 1 // Reset to first page when filters change
  };

  return updateSearchParams(currentSearchParams, updatesWithReset);
};

// Type definitions for better type safety
export type SearchParamsType = typeof searchParams;
export type SearchParamsKeys = keyof typeof searchParams;
export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;

// Constants for filter options
export const SAMPLE_TYPES = [
  'Vải mét',
  'Vải cây',
  'Mẫu nhỏ',
  'Mẫu lớn'
] as const;

export const COLORS = [
  'Trắng',
  'Đen',
  'Xám',
  'Đỏ',
  'Xanh',
  'Vàng',
  'Hồng',
  'Tím',
  'Cam',
  'Nâu'
] as const;

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
  { value: 'sku', label: 'SKU' },
  { value: 'weight', label: 'Trọng lượng' },
  { value: 'width', label: 'Chiều rộng' },
  { value: 'remaining_quantity', label: 'Số lượng còn lại' }
] as const;

export const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;
