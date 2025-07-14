'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useSample, useDeleteSample } from '@/hooks/use-api';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function SampleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sampleId = Number(params.sampleId);

  const { data: sample, isLoading, error } = useSample(sampleId);
  const deleteMutation = useDeleteSample();

  const handleEdit = () => {
    router.push(`/dashboard/sample/${sampleId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mẫu vải này?')) {
      try {
        await deleteMutation.mutateAsync(sampleId);
        router.push('/dashboard/sample');
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  if (isLoading) {
    return <SampleDetailSkeleton />;
  }

  if (error || !sample) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <div className='text-center'>
          <Package className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
          <h3 className='text-lg font-semibold'>Không tìm thấy mẫu vải</h3>
          <p className='text-muted-foreground mt-2'>
            Mẫu vải này không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => router.push('/dashboard/sample')}
            className='mt-4'
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>{sample.sku}</h1>
            <p className='text-muted-foreground'>
              {sample.product_name?.product_name_vi || 'N/A'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <PermissionGuard module='SAMPLE' action='UPDATE'>
            <Button onClick={handleEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </Button>
          </PermissionGuard>

          <PermissionGuard module='SAMPLE' action='DELETE'>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash className='mr-2 h-4 w-4' />
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Basic Information */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    SKU
                  </label>
                  <p className='font-mono text-lg font-medium'>{sample.sku}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Barcode
                  </label>
                  <p className='font-mono'>{sample.barcode || 'N/A'}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Tên sản phẩm (VI)
                  </label>
                  <p className='font-medium'>
                    {sample.product_name?.product_name_vi || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Tên sản phẩm (EN)
                  </label>
                  <p className='font-medium'>
                    {sample.product_name?.product_name_en || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Danh mục
                </label>
                <div className='mt-1'>
                  <Badge variant='outline'>
                    {sample.category?.category_name || 'N/A'}
                  </Badge>
                </div>
              </div>

              {sample.description && (
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Mô tả
                  </label>
                  <p className='mt-1 text-sm'>{sample.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Color & Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc & Chất lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Màu sắc
                  </label>
                  <div className='mt-1 flex items-center gap-2'>
                    <div
                      className='h-4 w-4 rounded border'
                      style={{ backgroundColor: getColorValue(sample.color) }}
                    />
                    <span className='font-medium'>{sample.color || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Mã màu
                  </label>
                  <p className='font-mono'>{sample.color_code || 'N/A'}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Chất lượng
                  </label>
                  <p>{sample.quality || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Thành phần sợi
                </label>
                <p>{sample.fiber_content || 'N/A'}</p>
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Nguồn gốc
                </label>
                <p className='text-sm'>{sample.source || 'N/A'}</p>
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Vị trí lưu trữ
                </label>
                <div className='mt-1'>
                  {sample.sample_location ? (
                    <Badge variant='outline'>{sample.sample_location}</Badge>
                  ) : (
                    <span className='text-muted-foreground'>N/A</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specifications Sidebar */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Loại mẫu
                </label>
                <div className='mt-1'>
                  {sample.sample_type ? (
                    <Badge>{sample.sample_type}</Badge>
                  ) : (
                    <span className='text-muted-foreground'>N/A</span>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Trọng lượng
                  </label>
                  <p className='text-lg font-medium'>
                    {sample.weight ? `${sample.weight} GSM` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Chiều rộng
                  </label>
                  <p className='text-lg font-medium'>
                    {sample.width ? `${sample.width} CM` : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Số lượng còn lại
                </label>
                <p
                  className={`text-lg font-medium ${getQuantityColor(sample.remaining_quantity)}`}
                >
                  {sample.remaining_quantity}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Ngày tạo
                </label>
                <p>
                  {format(new Date(sample.created_at), 'dd/MM/yyyy HH:mm', {
                    locale: vi
                  })}
                </p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Cập nhật lần cuối
                </label>
                <p>
                  {format(new Date(sample.updated_at), 'dd/MM/yyyy HH:mm', {
                    locale: vi
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SampleDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-9 w-20' />
          <div>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='mt-2 h-5 w-32' />
          </div>
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-20' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-40' />
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className='grid grid-cols-2 gap-4'>
                      <div>
                        <Skeleton className='mb-2 h-4 w-20' />
                        <Skeleton className='h-5 w-32' />
                      </div>
                      <div>
                        <Skeleton className='mb-2 h-4 w-20' />
                        <Skeleton className='h-5 w-28' />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='space-y-6'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j}>
                      <Skeleton className='mb-2 h-4 w-20' />
                      <Skeleton className='h-5 w-24' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getColorValue(color?: string): string {
  if (!color) return '#e5e7eb';

  const colorMap: Record<string, string> = {
    Trắng: '#ffffff',
    Đen: '#000000',
    Xám: '#808080',
    Đỏ: '#ff0000',
    Xanh: '#0000ff',
    Vàng: '#ffff00',
    Hồng: '#ffc0cb',
    Tím: '#800080',
    Cam: '#ffa500',
    Nâu: '#a52a2a'
  };

  return colorMap[color] || '#e5e7eb';
}

function getQuantityColor(quantity: number): string {
  if (quantity === 0) return 'text-destructive';
  if (quantity <= 5) return 'text-yellow-600';
  return 'text-green-600';
}
