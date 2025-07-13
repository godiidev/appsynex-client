'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='bg-background flex min-h-screen items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                <AlertTriangle className='text-destructive h-6 w-6' />
              </div>
              <CardTitle>Đã xảy ra lỗi!</CardTitle>
              <CardDescription>
                Xin lỗi, đã có lỗi xảy ra trong ứng dụng. Vui lòng thử lại hoặc
                liên hệ hỗ trợ.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && (
                <div className='bg-muted rounded-lg p-4'>
                  <p className='text-muted-foreground font-mono text-sm'>
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className='text-muted-foreground mt-2 text-xs'>
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className='flex gap-2'>
                <Button onClick={reset} className='flex-1'>
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Thử lại
                </Button>
                <Button
                  variant='outline'
                  onClick={() => (window.location.href = '/')}
                  className='flex-1'
                >
                  <Home className='mr-2 h-4 w-4' />
                  Trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
