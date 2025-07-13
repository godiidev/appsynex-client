import { Suspense } from 'react';
import { Metadata } from 'next';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryListing } from '@/features/categories/components/category-listing';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Quản lý danh mục - AppSynex',
  description: 'Quản lý danh mục sản phẩm trong hệ thống'
};

export default function CategoriesPage() {
  return (
    <ProtectedRoute
      requiredPermissions={[{ module: 'PRODUCT_CATEGORY', action: 'VIEW' }]}
    >
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Quản lý danh mục'
            description='Quản lý danh mục sản phẩm và cấu trúc phân loại'
          />
          <PermissionGuard module='PRODUCT_CATEGORY' action='CREATE'>
            <Button asChild>
              <Link href='/dashboard/categories/new'>
                <Plus className='mr-2 h-4 w-4' />
                Thêm danh mục
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Separator />

        <Suspense fallback={<div>Đang tải...</div>}>
          <CategoryListing />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
