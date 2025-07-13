//src/features/samples/components/sample-listing.tsx
import { SampleProduct } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { searchParamsCache } from '@/lib/searchparams';
import { SampleTable } from './sample-tables';
import { columns } from './sample-tables/columns';

type SampleListingPageProps = {};

export default async function SampleListingPage({}: SampleListingPageProps) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const category = searchParamsCache.get('category');
  const sampleType = searchParamsCache.get('sample_type');
  const color = searchParamsCache.get('color');
  const weightMin = searchParamsCache.get('weight_min');
  const weightMax = searchParamsCache.get('weight_max');
  const widthMin = searchParamsCache.get('width_min');
  const widthMax = searchParamsCache.get('width_max');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(category && { category }),
    ...(sampleType && { sample_type: sampleType }),
    ...(color && { color }),
    ...(weightMin && { weight_min: weightMin }),
    ...(weightMax && { weight_max: weightMax }),
    ...(widthMin && { width_min: widthMin }),
    ...(widthMax && { width_max: widthMax })
  };

  try {
    const data = await apiClient.getSamples(filters);
    const totalSamples = data.total_items;
    const samples: SampleProduct[] = data.items;

    return (
      <SampleTable data={samples} totalItems={totalSamples} columns={columns} />
    );
  } catch (error) {
    console.error('Error fetching samples:', error);
    // Return empty state or error component
    return <SampleTable data={[]} totalItems={0} columns={columns} />;
  }
}
