import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import SampleListingPage from '@/features/samples/components/sample-listing';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata = {
  title: 'Dashboard: Samples'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <ProtectedRoute
      requiredPermissions={[{ module: 'SAMPLE', action: 'VIEW' }]}
    >
      <PageContainer scrollable={false}>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title='Samples'
              description='Manage fabric samples (Server side table functionalities.)'
            />
            <PermissionGuard module='SAMPLE' action='CREATE'>
              <Link
                href='/dashboard/sample/new'
                className={cn(buttonVariants(), 'text-xs md:text-sm')}
              >
                <IconPlus className='mr-2 h-4 w-4' /> Add New
              </Link>
            </PermissionGuard>
          </div>
          <Separator />
          <Suspense
            key={key}
            fallback={
              <DataTableSkeleton
                columnCount={8}
                rowCount={10}
                filterCount={4}
              />
            }
          >
            <SampleListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
