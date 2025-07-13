'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { SampleProduct } from '@/types/api';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Package, Text, Palette, Weight, Ruler } from 'lucide-react';
import { CellAction } from './cell-action';
import {
  CATEGORY_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  COLOR_OPTIONS
} from './options';

export const columns: ColumnDef<SampleProduct>[] = [
  {
    id: 'sku',
    accessorKey: 'sku',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    cell: ({ cell }) => (
      <div className='font-mono font-medium'>
        {cell.getValue<SampleProduct['sku']>()}
      </div>
    ),
    meta: {
      label: 'SKU',
      placeholder: 'Search by SKU...',
      variant: 'text',
      icon: Package
    },
    enableColumnFilter: true
  },
  {
    id: 'product_name',
    accessorFn: (row) => row.product_name?.product_name_vi || '',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    cell: ({ row }) => {
      const productName = row.original.product_name;
      return (
        <div>
          <div className='font-medium'>
            {productName?.product_name_vi || 'N/A'}
          </div>
          <div className='text-muted-foreground text-sm'>
            {productName?.product_name_en || ''}
          </div>
        </div>
      );
    },
    meta: {
      label: 'Product Name',
      placeholder: 'Search products...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorFn: (row) => row.category?.category_name || '',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant='outline'>{category?.category_name || 'N/A'}</Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Category',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    id: 'sample_type',
    accessorKey: 'sample_type',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Loại mẫu' />
    ),
    cell: ({ cell }) => {
      const sampleType = cell.getValue<SampleProduct['sample_type']>();
      return <Badge variant='secondary'>{sampleType || 'N/A'}</Badge>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Sample Type',
      variant: 'select',
      options: SAMPLE_TYPE_OPTIONS
    }
  },
  {
    id: 'color',
    accessorKey: 'color',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Màu sắc' />
    ),
    cell: ({ cell }) => {
      const color = cell.getValue<SampleProduct['color']>();
      return (
        <div className='flex items-center gap-2'>
          <div
            className='h-4 w-4 rounded border'
            style={{
              backgroundColor: getColorValue(color)
            }}
          />
          {color || 'N/A'}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Color',
      variant: 'select',
      options: COLOR_OPTIONS,
      icon: Palette
    }
  },
  {
    id: 'weight',
    accessorKey: 'weight',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trọng lượng' />
    ),
    cell: ({ cell }) => {
      const weight = cell.getValue<SampleProduct['weight']>();
      return weight ? `${weight} GSM` : 'N/A';
    },
    meta: {
      label: 'Weight',
      variant: 'range',
      range: [0, 1000],
      unit: 'GSM',
      icon: Weight
    }
  },
  {
    id: 'width',
    accessorKey: 'width',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Chiều rộng' />
    ),
    cell: ({ cell }) => {
      const width = cell.getValue<SampleProduct['width']>();
      return width ? `${width} CM` : 'N/A';
    },
    meta: {
      label: 'Width',
      variant: 'range',
      range: [0, 300],
      unit: 'CM',
      icon: Ruler
    }
  },
  {
    id: 'remaining_quantity',
    accessorKey: 'remaining_quantity',
    header: ({ column }: { column: Column<SampleProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Còn lại' />
    ),
    cell: ({ cell }) => {
      const quantity = cell.getValue<SampleProduct['remaining_quantity']>();
      return (
        <Badge
          variant={
            quantity <= 5
              ? 'destructive'
              : quantity <= 10
                ? 'outline'
                : 'default'
          }
        >
          {quantity}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

// Helper function to get color value for display
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
