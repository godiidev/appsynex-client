'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SampleProduct } from '@/types/api';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const getColumns = (): ColumnDef<SampleProduct>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Chọn tất cả'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Chọn dòng'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-semibold'
      >
        SKU
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm font-medium'>{row.getValue('sku')}</div>
    )
  },
  {
    accessorKey: 'product_name',
    header: 'Tên sản phẩm',
    cell: ({ row }) => {
      const productName = row.original.product_name;
      return (
        <div className='max-w-[200px]'>
          <div className='truncate font-medium'>
            {productName?.product_name_vi || 'N/A'}
          </div>
          <div className='text-muted-foreground truncate text-sm'>
            {productName?.product_name_en || ''}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant='outline'>{category?.category_name || 'N/A'}</Badge>
      );
    }
  },
  {
    accessorKey: 'sample_type',
    header: 'Loại mẫu',
    cell: ({ row }) => {
      const sampleType = row.getValue('sample_type') as string;
      if (!sampleType)
        return <span className='text-muted-foreground'>N/A</span>;

      const getVariant = (type: string) => {
        switch (type) {
          case 'Vải mét':
            return 'default';
          case 'Vải cây':
            return 'secondary';
          case 'Mẫu nhỏ':
            return 'outline';
          case 'Mẫu lớn':
            return 'destructive';
          default:
            return 'outline';
        }
      };

      return (
        <Badge variant={getVariant(sampleType) as any}>{sampleType}</Badge>
      );
    }
  },
  {
    accessorKey: 'weight',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-semibold'
      >
        Trọng lượng
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const weight = row.getValue('weight') as number;
      return weight ? (
        <span className='font-medium'>{weight} GSM</span>
      ) : (
        <span className='text-muted-foreground'>N/A</span>
      );
    }
  },
  {
    accessorKey: 'width',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-semibold'
      >
        Chiều rộng
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const width = row.getValue('width') as number;
      return width ? (
        <span className='font-medium'>{width} CM</span>
      ) : (
        <span className='text-muted-foreground'>N/A</span>
      );
    }
  },
  {
    accessorKey: 'color',
    header: 'Màu sắc',
    cell: ({ row }) => {
      const color = row.getValue('color') as string;
      const colorCode = row.original.color_code;

      if (!color) return <span className='text-muted-foreground'>N/A</span>;

      return (
        <div className='flex items-center gap-2'>
          <div
            className='border-muted-foreground/20 h-4 w-4 rounded border'
            style={{ backgroundColor: getColorValue(color) }}
            title={colorCode || color}
          />
          <span className='font-medium'>{color}</span>
          {colorCode && (
            <span className='text-muted-foreground text-xs'>({colorCode})</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'remaining_quantity',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-semibold'
      >
        Số lượng
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('remaining_quantity') as number;

      const getQuantityColor = (qty: number) => {
        if (qty === 0) return 'text-destructive';
        if (qty <= 5) return 'text-yellow-600';
        return 'text-green-600';
      };

      return (
        <span className={`font-medium ${getQuantityColor(quantity)}`}>
          {quantity}
        </span>
      );
    }
  },
  {
    accessorKey: 'quality',
    header: 'Chất lượng',
    cell: ({ row }) => {
      const quality = row.getValue('quality') as string;
      return quality ? (
        <span className='text-sm'>{quality}</span>
      ) : (
        <span className='text-muted-foreground'>N/A</span>
      );
    }
  },
  {
    accessorKey: 'sample_location',
    header: 'Vị trí',
    cell: ({ row }) => {
      const location = row.getValue('sample_location') as string;
      return location ? (
        <Badge variant='outline' className='text-xs'>
          {location}
        </Badge>
      ) : (
        <span className='text-muted-foreground'>N/A</span>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-semibold'
      >
        Ngày tạo
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return (
        <div className='text-sm'>
          {format(new Date(date), 'dd/MM/yyyy', { locale: vi })}
        </div>
      );
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

// Helper function to get color value for display
function getColorValue(color: string): string {
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
    Nâu: '#a52a2a',
    White: '#ffffff',
    Black: '#000000',
    Gray: '#808080',
    Grey: '#808080',
    Red: '#ff0000',
    Blue: '#0000ff',
    Yellow: '#ffff00',
    Pink: '#ffc0cb',
    Purple: '#800080',
    Orange: '#ffa500',
    Brown: '#a52a2a'
  };

  return colorMap[color] || '#e5e7eb';
}
