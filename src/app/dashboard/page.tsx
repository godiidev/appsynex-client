import { Suspense } from 'react';
import { Metadata } from 'next';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SampleListing } from '@/features/samples/components/sample-listing';
import { CanCreateSamples } from '@/components/auth/permission-guard';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Quản lý mẫu vải - AppSynex',
  description: 'Quản lý và theo dõi các mẫu vải trong hệ thống'
};

function SampleListingSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-10 w-[200px]' />
        <Skeleton className='h-10 w-[150px]' />
      </div>
      <div className='rounded-lg border'>
        <div className='p-4'>
          <Skeleton className='h-6 w-full' />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='border-t p-4'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[150px]' />
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[80px]' />
              <Skeleton className='h-8 w-[60px]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SamplesPage() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Heading
          title='Quản lý mẫu vải'
          description='Quản lý và theo dõi các mẫu vải trong hệ thống'
        />
        <CanCreateSamples>
          <Button asChild>
            <Link href='/dashboard/samples/new'>
              <Plus className='mr-2 h-4 w-4' />
              Thêm mẫu mới
            </Link>
          </Button>
        </CanCreateSamples>
      </div>

      <Separator />

      <Suspense fallback={<SampleListingSkeleton />}>
        <SampleListing />
      </Suspense>
    </div>
  );
}
