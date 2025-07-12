import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, BarChart3, Shield, Palette, Zap } from 'lucide-react';
import { PublicHeader } from '@/components/public/public-header';

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: 'Quản lý mẫu vải',
      description:
        'Theo dõi và quản lý toàn bộ mẫu vải với thông tin chi tiết về trọng lượng, chiều rộng, màu sắc.'
    },
    {
      icon: Users,
      title: 'Phân quyền người dùng',
      description:
        'Hệ thống phân quyền chi tiết theo vai trò và chức năng cụ thể.'
    },
    {
      icon: BarChart3,
      title: 'Báo cáo & Thống kê',
      description:
        'Theo dõi hiệu suất và tạo báo cáo chi tiết về hoạt động kinh doanh.'
    },
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description:
        'Hệ thống xác thực JWT và mã hóa dữ liệu đảm bảo an toàn tuyệt đối.'
    },
    {
      icon: Palette,
      title: 'Giao diện hiện đại',
      description:
        'Thiết kế đáp ứng với chế độ sáng/tối và trải nghiệm người dùng tối ưu.'
    },
    {
      icon: Zap,
      title: 'Hiệu suất cao',
      description:
        'Xử lý nhanh chóng với hệ thống cache và tối ưu hóa truy vấn database.'
    }
  ];

  const sampleProducts = [
    {
      sku: 'SY1015205185-WHT',
      name: 'Cotton Single Jersey',
      weight: '205 GSM',
      width: '185 CM',
      color: 'Trắng',
      category: 'Vải Thun Cotton'
    },
    {
      sku: 'SY1015220180-BLK',
      name: 'Cotton Single Jersey',
      weight: '180 GSM',
      width: '220 CM',
      color: 'Đen',
      category: 'Vải Thun Cotton'
    },
    {
      sku: 'SY1021180175-GRY',
      name: 'Cotton Rib 1x1',
      weight: '180 GSM',
      width: '175 CM',
      color: 'Xám',
      category: 'Vải Thun Cotton'
    }
  ];

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      {/* Hero Section */}
      <section className='px-6 py-24 md:py-32 lg:py-40'>
        <div className='container mx-auto text-center'>
          <div className='mx-auto max-w-4xl'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'>
              Hệ Thống Quản Lý
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                {' '}
                Mẫu Vải{' '}
              </span>
              Chuyên Nghiệp
            </h1>
            <p className='text-muted-foreground mt-6 text-lg leading-8 md:text-xl'>
              AppSynex cung cấp giải pháp quản lý mẫu vải toàn diện cho doanh
              nghiệp dệt may, giúp tối ưu hóa quy trình làm việc và nâng cao
              hiệu quả kinh doanh.
            </p>
            <div className='mt-10 flex items-center justify-center gap-4'>
              <Button asChild size='lg' className='px-8 py-6 text-lg'>
                <Link href='/auth/sign-in'>Đăng nhập hệ thống</Link>
              </Button>
              <Button variant='outline' size='lg' className='px-8 py-6 text-lg'>
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-muted/50 px-6 py-24'>
        <div className='container mx-auto'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Tính Năng Nổi Bật
            </h2>
            <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
              Giải pháp toàn diện với các tính năng hiện đại và dễ sử dụng
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='border-0 shadow-md transition-shadow hover:shadow-lg'
              >
                <CardHeader>
                  <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <feature.icon className='text-primary h-6 w-6' />
                  </div>
                  <CardTitle className='text-xl'>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base leading-relaxed'>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Products Showcase */}
      <section className='px-6 py-24'>
        <div className='container mx-auto'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Mẫu Sản Phẩm
            </h2>
            <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
              Một số mẫu vải tiêu biểu trong hệ thống quản lý
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {sampleProducts.map((product, index) => (
              <Card
                key={index}
                className='overflow-hidden transition-shadow hover:shadow-lg'
              >
                <div className='flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'>
                  <Package className='text-muted-foreground h-16 w-16' />
                </div>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg'>{product.name}</CardTitle>
                    <Badge variant='secondary'>{product.category}</Badge>
                  </div>
                  <CardDescription className='font-mono text-sm'>
                    {product.sku}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Trọng lượng:
                      </span>
                      <span className='font-medium'>{product.weight}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Chiều rộng:</span>
                      <span className='font-medium'>{product.width}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Màu sắc:</span>
                      <span className='font-medium'>{product.color}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary text-primary-foreground px-6 py-24'>
        <div className='container mx-auto text-center'>
          <h2 className='mb-6 text-3xl font-bold tracking-tight sm:text-4xl'>
            Sẵn sàng bắt đầu?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg opacity-90'>
            Đăng nhập vào hệ thống để trải nghiệm đầy đủ các tính năng quản lý
            mẫu vài chuyên nghiệp.
          </p>
          <Button
            asChild
            size='lg'
            variant='secondary'
            className='px-8 py-6 text-lg'
          >
            <Link href='/auth/sign-in'>Đăng nhập ngay</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t px-6 py-12'>
        <div className='text-muted-foreground container mx-auto text-center'>
          <p>&copy; 2024 AppSynex. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
