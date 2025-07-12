'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  useCreateSample,
  useUpdateSample,
  useCategories,
  useProductNames
} from '@/hooks/use-api';
import { SampleProduct } from '@/types/api';

const sampleSchema = z.object({
  sku: z.string().min(1, 'SKU là bắt buộc'),
  product_name_id: z.number().min(1, 'Vui lòng chọn tên sản phẩm'),
  category_id: z.number().min(1, 'Vui lòng chọn danh mục'),
  description: z.string().optional(),
  sample_type: z.string().optional(),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  color: z.string().optional(),
  color_code: z.string().optional(),
  quality: z.string().optional(),
  remaining_quantity: z.number().min(0).optional(),
  fiber_content: z.string().optional(),
  source: z.string().optional(),
  sample_location: z.string().optional(),
  barcode: z.string().optional()
});

type SampleFormValues = z.infer<typeof sampleSchema>;

interface SampleFormProps {
  initialData?: SampleProduct;
  isEditing?: boolean;
}

export function SampleForm({
  initialData,
  isEditing = false
}: SampleFormProps) {
  const router = useRouter();
  const createMutation = useCreateSample();
  const updateMutation = useUpdateSample();
  const { data: categoriesData } = useCategories();
  const { data: productNames } = useProductNames();

  const categories = categoriesData?.categories || [];
  const sampleTypes = ['Vải mét', 'Vải cây', 'Mẫu nhỏ', 'Mẫu lớn'];

  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      sku: '',
      product_name_id: 0,
      category_id: 0,
      description: '',
      sample_type: '',
      weight: 0,
      width: 0,
      color: '',
      color_code: '',
      quality: '',
      remaining_quantity: 0,
      fiber_content: '',
      source: '',
      sample_location: '',
      barcode: ''
    }
  });

  // Set initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        sku: initialData.sku,
        product_name_id: initialData.product_name_id,
        category_id: initialData.category_id,
        description: initialData.description || '',
        sample_type: initialData.sample_type || '',
        weight: initialData.weight || 0,
        width: initialData.width || 0,
        color: initialData.color || '',
        color_code: initialData.color_code || '',
        quality: initialData.quality || '',
        remaining_quantity: initialData.remaining_quantity || 0,
        fiber_content: initialData.fiber_content || '',
        source: initialData.source || '',
        sample_location: initialData.sample_location || '',
        barcode: initialData.barcode || ''
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = async (values: SampleFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...values
        });
        router.push(`/dashboard/samples/${initialData.id}`);
      } else {
        const result = await createMutation.mutateAsync(values);
        router.push(`/dashboard/samples/${result.id}`);
      }
    } catch (error) {
      // Error handling is done in the mutations
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isEditing ? 'Chỉnh sửa mẫu vải' : 'Thêm mẫu vải mới'}
          </h2>
          <p className='text-muted-foreground'>
            {isEditing
              ? 'Cập nhật thông tin mẫu vải'
              : 'Nhập thông tin chi tiết cho mẫu vải mới'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <X className='mr-2 h-4 w-4' />
            Hủy
          </Button>
          <Button type='submit' form='sample-form' disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 h-4 w-4' />
            )}
            {isEditing ? 'Cập nhật' : 'Tạo mẫu'}
          </Button>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form
          id='sample-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Basic Information */}
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Nhập thông tin chính của mẫu vải
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='sku'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='VD: SY1015205185-WHT'
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='barcode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Mã vạch'
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='product_name_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sản phẩm *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Chọn tên sản phẩm' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productNames?.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.product_name_vi} (
                                  {product.product_name_en})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='category_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Chọn danh mục' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.category_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Mô tả chi tiết về mẫu vải...'
                            className='min-h-[100px]'
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Specifications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật</CardTitle>
                  <CardDescription>
                    Chi tiết về trọng lượng, kích thước
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='sample_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại mẫu</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn loại mẫu' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sampleTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='weight'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trọng lượng (GSM)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='205'
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='width'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiều rộng (CM)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='185'
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='remaining_quantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng còn lại</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='10'
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Color & Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc & Chất lượng</CardTitle>
              <CardDescription>
                Thông tin về màu sắc và chất lượng sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Màu sắc</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='VD: Trắng, Đen, Xám...'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='color_code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã màu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='VD: 250304A'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='quality'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chất lượng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='VD: Hàng bền màu 4'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
              <CardDescription>
                Thông tin về thành phần sợi, nguồn gốc và vị trí lưu trữ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='fiber_content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành phần sợi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='VD: 100% Cotton'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='sample_location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí lưu trữ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='VD: Kệ A-12'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='source'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nguồn gốc</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='VD: CMP20W mua việt thắng, dệt anh soạn'
                        className='min-h-[80px]'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
