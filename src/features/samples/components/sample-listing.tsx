//src/features/samples/components/sample-listing.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useSamples } from '@/hooks/use-api';
import { SampleFilters } from './sample-filters';
import { SampleTable } from './sample-tables';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function SampleListing() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(''),
      category: parseAsString.withDefault(''),
      sample_type: parseAsString.withDefault(''),
      color: parseAsString.withDefault(''),
      weight_min: parseAsInteger,
      weight_max: parseAsInteger,
      width_min: parseAsInteger,
      width_max: parseAsInteger
    },
    {
      history: 'push'
    }
  );

  const { data, isLoading, error } = useSamples(filters);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters({
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  if (error) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Lỗi tải dữ liệu
          </h3>
          <p className='text-muted-foreground mt-2'>
            {error.message || 'Không thể tải danh sách mẫu vải'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <SampleFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <SampleTable
        data={data?.items || []}
        totalItems={data?.total_items || 0}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
