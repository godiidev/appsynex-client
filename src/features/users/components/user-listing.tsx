'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/use-api';
import { UserTable } from './user-table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function UserListing() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);

  const { data, isLoading, error } = useUsers(page, limit, search);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  if (error) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Lỗi tải dữ liệu
          </h3>
          <p className='text-muted-foreground mt-2'>
            {error.message || 'Không thể tải danh sách người dùng'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Search */}
      <div className='relative max-w-sm'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Tìm kiếm theo tên đăng nhập hoặc email...'
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      <UserTable
        data={data?.items || []}
        totalItems={data?.total_items || 0}
        currentPage={page}
        pageSize={limit}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
