'use client';

import { useCategories, useDeleteCategory } from '@/hooks/use-api';
import { CategoryResponse } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash, Plus, FolderTree } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function CategoryListing() {
  const { data, isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className='bg-muted h-6 w-3/4 animate-pulse rounded' />
              <div className='bg-muted h-4 w-1/2 animate-pulse rounded' />
            </CardHeader>
            <CardContent>
              <div className='bg-muted mb-2 h-4 w-full animate-pulse rounded' />
              <div className='bg-muted h-4 w-2/3 animate-pulse rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Lỗi tải dữ liệu
          </h3>
          <p className='text-muted-foreground mt-2'>
            {error.message || 'Không thể tải danh sách danh mục'}
          </p>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];

  // Group categories by parent
  const parentCategories = categories.filter((cat) => !cat.parent_category_id);
  const childCategories = categories.filter((cat) => cat.parent_category_id);

  const handleEdit = (id: number) => {
    router.push(`/dashboard/categories/${id}/edit`);
  };

  const handleDelete = async (category: CategoryResponse) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${category.category_name}"?`
      )
    ) {
      try {
        await deleteMutation.mutateAsync(category.id);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const getChildCategories = (parentId: number) => {
    return childCategories.filter((cat) => cat.parent_category_id === parentId);
  };

  if (categories.length === 0) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <div className='text-center'>
          <FolderTree className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
          <h3 className='text-lg font-semibold'>Chưa có danh mục nào</h3>
          <p className='text-muted-foreground mt-2 mb-4'>
            Bắt đầu bằng cách tạo danh mục đầu tiên cho sản phẩm
          </p>
          <PermissionGuard module='PRODUCT_CATEGORY' action='CREATE'>
            <Button onClick={() => router.push('/dashboard/categories/new')}>
              <Plus className='mr-2 h-4 w-4' />
              Tạo danh mục đầu tiên
            </Button>
          </PermissionGuard>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng danh mục</CardTitle>
            <FolderTree className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Danh mục gốc</CardTitle>
            <FolderTree className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{parentCategories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Danh mục con</CardTitle>
            <FolderTree className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{childCategories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className='space-y-6'>
        {parentCategories.map((category) => {
          const children = getChildCategories(category.id);

          return (
            <div key={category.id} className='space-y-4'>
              {/* Parent Category */}
              <Card className='border-l-primary border-l-4'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle className='flex items-center gap-2'>
                        <FolderTree className='h-5 w-5' />
                        {category.category_name}
                        <Badge variant='outline'>Gốc</Badge>
                      </CardTitle>
                      <CardDescription>
                        {category.description || 'Không có mô tả'}
                      </CardDescription>
                    </div>
                    <CategoryActions
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={deleteMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-muted-foreground flex items-center justify-between text-sm'>
                    <span>
                      Tạo ngày:{' '}
                      {format(new Date(category.created_at), 'dd/MM/yyyy', {
                        locale: vi
                      })}
                    </span>
                    <span>{children.length} danh mục con</span>
                  </div>
                </CardContent>
              </Card>

              {/* Child Categories */}
              {children.length > 0 && (
                <div className='ml-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {children.map((child) => (
                    <Card key={child.id} className='border-l-muted border-l-2'>
                      <CardHeader>
                        <div className='flex items-center justify-between'>
                          <div>
                            <CardTitle className='text-base'>
                              {child.category_name}
                            </CardTitle>
                            <CardDescription>
                              {child.description || 'Không có mô tả'}
                            </CardDescription>
                          </div>
                          <CategoryActions
                            category={child}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={deleteMutation.isPending}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='text-muted-foreground text-sm'>
                          Tạo ngày:{' '}
                          {format(new Date(child.created_at), 'dd/MM/yyyy', {
                            locale: vi
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Orphaned child categories (shouldn't happen but just in case) */}
        {childCategories.some(
          (cat) =>
            !parentCategories.find((p) => p.id === cat.parent_category_id)
        ) && (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Danh mục khác</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {childCategories
                .filter(
                  (cat) =>
                    !parentCategories.find(
                      (p) => p.id === cat.parent_category_id
                    )
                )
                .map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <div>
                          <CardTitle>{category.category_name}</CardTitle>
                          <CardDescription>
                            {category.description || 'Không có mô tả'}
                          </CardDescription>
                        </div>
                        <CategoryActions
                          category={category}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isDeleting={deleteMutation.isPending}
                        />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryActionsProps {
  category: CategoryResponse;
  onEdit: (id: number) => void;
  onDelete: (category: CategoryResponse) => void;
  isDeleting: boolean;
}

function CategoryActions({
  category,
  onEdit,
  onDelete,
  isDeleting
}: CategoryActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

        <PermissionGuard module='PRODUCT_CATEGORY' action='UPDATE'>
          <DropdownMenuItem onClick={() => onEdit(category.id)}>
            <Edit className='mr-2 h-4 w-4' />
            Chỉnh sửa
          </DropdownMenuItem>
        </PermissionGuard>

        <PermissionGuard module='PRODUCT_CATEGORY' action='DELETE'>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(category)}
            className='text-destructive focus:text-destructive'
            disabled={isDeleting}
          >
            <Trash className='mr-2 h-4 w-4' />
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </DropdownMenuItem>
        </PermissionGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
