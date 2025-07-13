import { searchParamsCache } from '@/lib/searchparams';
import { SampleListing } from '@/features/samples/components/sample-listing';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: SearchParams;
};

export default async function SamplesPage({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý mẫu vải</h1>
        <p className='text-muted-foreground'>
          Danh sách và quản lý các mẫu vải trong hệ thống
        </p>
      </div>

      <SampleListing />
    </div>
  );
}
