'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useCategories } from '@/hooks/use-api';
import { Badge } from '@/components/ui/badge';

interface SampleFiltersProps {
  filters: {
    search: string;
    category: string;
    sample_type: string;
    color: string;
    weight_min?: number;
    weight_max?: number;
    width_min?: number;
    width_max?: number;
  };
  onFiltersChange: (filters: Partial<SampleFiltersProps['filters']>) => void;
  isLoading?: boolean;
}

export function SampleFilters({
  filters,
  onFiltersChange,
  isLoading
}: SampleFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { data: categoriesData } = useCategories();

  const categories = categoriesData?.categories || [];

  const sampleTypes = ['Vải mét', 'Vải cây', 'Mẫu nhỏ', 'Mẫu lớn'];

  const handleInputChange = (key: string, value: string | number) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Immediate update for search
    if (key === 'search') {
      onFiltersChange({ [key]: value });
    }
  };

  const handleSelectChange = (key: string, value: string) => {
    const newValue = value === 'all' ? '' : value;
    const newFilters = { ...localFilters, [key]: newValue };
    setLocalFilters(newFilters);
    onFiltersChange({ [key]: newValue });
  };

  const applyAdvancedFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      sample_type: '',
      color: '',
      weight_min: undefined,
      weight_max: undefined,
      width_min: undefined,
      width_max: undefined
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      key !== 'page' && key !== 'limit' && value !== '' && value !== undefined
  );

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) =>
      key !== 'page' && key !== 'limit' && value !== '' && value !== undefined
  ).length;

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Tìm kiếm theo SKU, tên sản phẩm, màu sắc...'
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className='pl-10'
            disabled={isLoading}
          />
        </div>

        {/* Quick Filters */}
        <div className='flex gap-2'>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Danh mục' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sample_type || 'all'}
            onValueChange={(value) => handleSelectChange('sample_type', value)}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Loại mẫu' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả loại</SelectItem>
              {sampleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className='relative'>
                <Filter className='mr-2 h-4 w-4' />
                Lọc nâng cao
                {activeFiltersCount > 0 && (
                  <Badge
                    variant='destructive'
                    className='absolute -top-2 -right-2 h-5 w-5 p-0 text-xs'
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='end'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='color'>Màu sắc</Label>
                  <Input
                    id='color'
                    placeholder='Nhập màu sắc'
                    value={localFilters.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='weight-min'>Trọng lượng min (GSM)</Label>
                    <Input
                      id='weight-min'
                      type='number'
                      placeholder='Min'
                      value={localFilters.weight_min || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'weight_min',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='weight-max'>Trọng lượng max (GSM)</Label>
                    <Input
                      id='weight-max'
                      type='number'
                      placeholder='Max'
                      value={localFilters.weight_max || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'weight_max',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='width-min'>Chiều rộng min (CM)</Label>
                    <Input
                      id='width-min'
                      type='number'
                      placeholder='Min'
                      value={localFilters.width_min || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'width_min',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='width-max'>Chiều rộng max (CM)</Label>
                    <Input
                      id='width-max'
                      type='number'
                      placeholder='Max'
                      value={localFilters.width_max || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'width_max',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters}
                  >
                    <X className='mr-2 h-4 w-4' />
                    Xóa bộ lọc
                  </Button>
                  <Button size='sm' onClick={applyAdvancedFilters}>
                    Áp dụng
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === 'page' || key === 'limit') return null;

            let displayValue = value.toString();
            let displayKey = key;

            // Format display names
            switch (key) {
              case 'search':
                displayKey = 'Tìm kiếm';
                break;
              case 'category':
                displayKey = 'Danh mục';
                const category = categories.find(
                  (c) => c.id.toString() === value
                );
                displayValue = category?.category_name || value.toString();
                break;
              case 'sample_type':
                displayKey = 'Loại mẫu';
                break;
              case 'color':
                displayKey = 'Màu sắc';
                break;
              case 'weight_min':
                displayKey = 'Trọng lượng tối thiểu';
                displayValue = `${value} GSM`;
                break;
              case 'weight_max':
                displayKey = 'Trọng lượng tối đa';
                displayValue = `${value} GSM`;
                break;
              case 'width_min':
                displayKey = 'Chiều rộng tối thiểu';
                displayValue = `${value} CM`;
                break;
              case 'width_max':
                displayKey = 'Chiều rộng tối đa';
                displayValue = `${value} CM`;
                break;
            }

            return (
              <Badge key={key} variant='secondary' className='gap-1'>
                <span className='text-xs'>
                  {displayKey}: {displayValue}
                </span>
                <X
                  className='hover:text-destructive h-3 w-3 cursor-pointer'
                  onClick={() =>
                    onFiltersChange({
                      [key]:
                        key.includes('_min') || key.includes('_max')
                          ? undefined
                          : ''
                    })
                  }
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
