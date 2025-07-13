'use client';

import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Users,
  FolderTree,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useSamples, useUsers, useCategories } from '@/hooks/use-api';
import { useAuth } from '@/providers/auth-provider';
import { PermissionGuard } from '@/components/auth/permission-guard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Chào mừng trở lại, {user?.username}!
          </h1>
          <p className='text-muted-foreground'>
            Đây là tổng quan về hệ thống quản lý mẫu vải của bạn.
          </p>
        </div>
        <div className='flex gap-2'>
          <PermissionGuard module='SAMPLE' action='CREATE'>
            <Button asChild>
              <Link href='/dashboard/samples/new'>
                <Plus className='mr-2 h-4 w-4' />
                Thêm mẫu vải
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Quick Actions & Recent Activity */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Low Stock Alert */}
      <Suspense fallback={<LowStockAlertSkeleton />}>
        <LowStockAlert />
      </Suspense>
    </div>
  );
}

function StatsCards() {
  const { data: samplesData } = useSamples({ limit: 1 });
  const { data: usersData } = useUsers(1, 1);
  const { data: categoriesData } = useCategories();

  const totalSamples = samplesData?.total_items || 0;
  const totalUsers = usersData?.total_items || 0;
  const totalCategories = categoriesData?.total || 0;

  const stats = [
    {
      title: 'Tổng mẫu vải',
      value: totalSamples,
      description: 'Tổng số mẫu vải trong hệ thống',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Người dùng',
      value: totalUsers,
      description: 'Tổng số người dùng đã đăng ký',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Danh mục',
      value: totalCategories,
      description: 'Số danh mục sản phẩm',
      icon: FolderTree,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Hiệu suất',
      value: '98%',
      description: 'Tỷ lệ hoạt động hệ thống',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <div className={`rounded-md p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentActivity() {
  const { data: recentSamples } = useSamples({ limit: 5, page: 1 });

  const samples = recentSamples?.items || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mẫu vải mới nhất</CardTitle>
        <CardDescription>Các mẫu vải được thêm gần đây nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {samples.length > 0 ? (
            samples.map((sample) => (
              <div
                key={sample.id}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
                    <Package className='text-muted-foreground h-5 w-5' />
                  </div>
                  <div>
                    <p className='font-medium'>{sample.sku}</p>
                    <p className='text-muted-foreground text-sm'>
                      {sample.product_name?.product_name_vi || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <Badge variant='outline'>
                    {sample.category?.category_name}
                  </Badge>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {sample.color || 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='py-6 text-center'>
              <Package className='text-muted-foreground mx-auto mb-2 h-12 w-12' />
              <p className='text-muted-foreground'>Chưa có mẫu vải nào</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const { hasPermission } = useAuth();

  const actions = [
    {
      title: 'Thêm mẫu vải',
      description: 'Tạo mẫu vải mới',
      href: '/dashboard/samples/new',
      icon: Package,
      permission: { module: 'SAMPLE', action: 'CREATE' }
    },
    {
      title: 'Quản lý người dùng',
      description: 'Thêm hoặc chỉnh sửa người dùng',
      href: '/dashboard/users',
      icon: Users,
      permission: { module: 'USER', action: 'VIEW' }
    },
    {
      title: 'Thêm danh mục',
      description: 'Tạo danh mục sản phẩm mới',
      href: '/dashboard/categories/new',
      icon: FolderTree,
      permission: { module: 'PRODUCT_CATEGORY', action: 'CREATE' }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hành động nhanh</CardTitle>
        <CardDescription>Các tác vụ thường dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {actions.map((action, index) => (
            <PermissionGuard
              key={index}
              module={action.permission.module}
              action={action.permission.action}
            >
              <Button
                variant='outline'
                className='w-full justify-start'
                asChild
              >
                <Link href={action.href}>
                  <action.icon className='mr-2 h-4 w-4' />
                  <div className='text-left'>
                    <div className='font-medium'>{action.title}</div>
                    <div className='text-muted-foreground text-xs'>
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            </PermissionGuard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LowStockAlert() {
  const { data: samplesData } = useSamples({
    limit: 50,
    page: 1
  });

  const samples = samplesData?.items || [];
  const lowStockSamples = samples.filter(
    (sample) => sample.remaining_quantity <= 5
  );

  if (lowStockSamples.length === 0) {
    return null;
  }

  return (
    <Card className='border-yellow-200 bg-yellow-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-yellow-800'>
          <AlertTriangle className='h-5 w-5' />
          Cảnh báo tồn kho thấp
        </CardTitle>
        <CardDescription className='text-yellow-700'>
          {lowStockSamples.length} mẫu vải có số lượng tồn kho thấp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {lowStockSamples.slice(0, 5).map((sample) => (
            <div
              key={sample.id}
              className='flex items-center justify-between rounded border bg-white p-2'
            >
              <div>
                <p className='font-medium'>{sample.sku}</p>
                <p className='text-muted-foreground text-sm'>
                  {sample.product_name?.product_name_vi}
                </p>
              </div>
              <div className='text-right'>
                <Badge
                  variant={
                    sample.remaining_quantity === 0 ? 'destructive' : 'outline'
                  }
                >
                  Còn {sample.remaining_quantity}
                </Badge>
              </div>
            </div>
          ))}
          {lowStockSamples.length > 5 && (
            <p className='text-muted-foreground pt-2 text-center text-sm'>
              Và {lowStockSamples.length - 5} mẫu khác...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton components
function StatsCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-8 w-8 rounded-md' />
          </CardHeader>
          <CardContent>
            <Skeleton className='mb-1 h-8 w-16' />
            <Skeleton className='h-3 w-24' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-48' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-10 w-10 rounded-lg' />
                <div>
                  <Skeleton className='mb-1 h-4 w-24' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </div>
              <div className='text-right'>
                <Skeleton className='mb-1 h-5 w-16' />
                <Skeleton className='h-3 w-12' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LowStockAlertSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-56' />
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded border p-2'
            >
              <div>
                <Skeleton className='mb-1 h-4 w-28' />
                <Skeleton className='h-3 w-36' />
              </div>
              <Skeleton className='h-5 w-16' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
