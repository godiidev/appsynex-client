'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle/theme-toggle';
import { useAuth } from '@/providers/auth-provider';

export function PublicHeader() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto px-6'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <Package className='h-6 w-6' />
            <span className='text-xl font-bold'>AppSynex</span>
          </Link>

          {/* Navigation */}
          <nav className='hidden items-center space-x-6 md:flex'>
            <Link
              href='#features'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Tính năng
            </Link>
            <Link
              href='#products'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Sản phẩm
            </Link>
            <Link
              href='#about'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Giới thiệu
            </Link>
          </nav>

          {/* Right section */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            {isAuthenticated ? (
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-sm'>
                  Chào, {user?.username}
                </span>
                <Button asChild size='sm'>
                  <Link href='/dashboard'>Vào hệ thống</Link>
                </Button>
              </div>
            ) : (
              <Button asChild size='sm'>
                <Link href='/auth/sign-in'>Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
