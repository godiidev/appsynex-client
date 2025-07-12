//src/components/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: { module: string; action: string }[];
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return (
        fallback || (
          <div className='flex h-96 w-full items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-lg font-semibold'>Không có quyền truy cập</h2>
              <p className='text-muted-foreground'>
                Bạn không có quyền truy cập vào khu vực này.
              </p>
            </div>
          </div>
        )
      );
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(
      ({ module, action }) => hasPermission(module, action)
    );

    if (!hasRequiredPermissions) {
      return (
        fallback || (
          <div className='flex h-96 w-full items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-lg font-semibold'>Không đủ quyền hạn</h2>
              <p className='text-muted-foreground'>
                Bạn không có quyền thực hiện thao tác này.
              </p>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
}
