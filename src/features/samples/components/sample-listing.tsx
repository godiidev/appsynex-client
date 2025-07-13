//src/features/samples/components/sample-listing.tsx - Updated for server-side auth
import { SampleProduct } from '@/types/api';
import { ApiClient } from '@/lib/api-client';
import { requireAuth, requirePermission } from '@/lib/server-auth';
import { searchParamsCache } from '@/lib/searchparams';
import { SampleTable } from './sample-tables';
import { columns } from './sample-tables/columns';

type SampleListingPageProps = {};

export default async function SampleListingPage({}: SampleListingPageProps) {
  // Check authentication and permission
  const token = await requireAuth();
  await requirePermission('SAMPLE', 'VIEW');

  // Create server-side API client with token
  const serverApiClient = ApiClient.createServerClient(token);

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
    console.log('Server-side fetching samples with token and filters:', {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
      filters
    });

    const data = await serverApiClient.getSamples(filters);
    const totalSamples = data.total_items;
    const samples: SampleProduct[] = data.items;

    return (
      <SampleTable data={samples} totalItems={totalSamples} columns={columns} />
    );
  } catch (error) {
    console.error('Error fetching samples on server-side:', error);

    // If it's an auth error, redirect to login
    if (
      error instanceof Error &&
      error.message.includes('Authentication required')
    ) {
      console.error(
        'Authentication error on server-side, redirecting to login'
      );
      // Don't use redirect here as it might cause issues
      // Instead, return empty state and let client-side handle it
    }

    // For other errors, return empty state
    return <SampleTable data={[]} totalItems={0} columns={columns} />;
  }
}
