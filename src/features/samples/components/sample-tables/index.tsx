//src/app/features/samples/components/sample-tables/index.tsx
'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Suspense } from 'react';

interface SampleTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

function SampleTableContent<TData, TValue>({
  data,
  totalItems,
  columns
}: SampleTableProps<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // sample data
    columns, // sample columns
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring.
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export function SampleTable<TData, TValue>(
  props: SampleTableProps<TData, TValue>
) {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center p-8'>
          <div className='text-muted-foreground text-sm'>Loading table...</div>
        </div>
      }
    >
      <SampleTableContent {...props} />
    </Suspense>
  );
}
