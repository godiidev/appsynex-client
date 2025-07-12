import { Suspense } from 'react';
import { Metadata } from 'next';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserListing } from '@/features/users/components/user-listing';
import { CanManageUsers } from '@/components/auth/permission-guard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Quản lý người dùng - AppSynex',
  description: 'Quản lý người dùng và phân quyền trong hệ thống'
};

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermissions={[{ module: 'USER', action: 'VIEW' }]}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Quản lý người dùng'
            description='Quản lý tài khoản người dùng và phân quyền trong hệ thống'
          />
          <CanManageUsers>
            <Button asChild>
              <Link href='/dashboard/users/new'>
                <Plus className='mr-2 h-4 w-4' />
                Thêm người dùng
              </Link>
            </Button>
          </CanManageUsers>
        </div>

        <Separator />

        <Suspense fallback={<div>Đang tải...</div>}>
          <UserListing />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
