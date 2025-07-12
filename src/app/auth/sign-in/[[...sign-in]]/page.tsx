import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập - AppSynex',
  description: 'Đăng nhập vào hệ thống quản lý mẫu vải AppSynex'
};

export default function SignInPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-6'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/' className='flex items-center'>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Về trang chủ
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className='text-muted-foreground p-6 text-center text-sm'>
        <p>&copy; 2024 AppSynex. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  );
}
