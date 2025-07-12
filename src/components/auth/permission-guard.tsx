'use client';

import { useAuth } from '@/providers/auth-provider';

interface PermissionGuardProps {
  module: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: string[];
}

export function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
  roles = []
}: PermissionGuardProps) {
  const { hasPermission, hasRole, isAuthenticated } = useAuth();

  // If not authenticated, don't show anything
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check role requirements first (if specified)
  if (roles.length > 0) {
    const hasRequiredRole = roles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Check permission
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module='SYSTEM'
      action='VIEW'
      roles={['SUPER_ADMIN', 'ADMIN']}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
}

export function SuperAdminOnly({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard
      module='SYSTEM'
      action='MANAGE_SETTINGS'
      roles={['SUPER_ADMIN']}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
}

export function CanViewSamples({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard module='SAMPLE' action='VIEW' fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanCreateSamples({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard module='SAMPLE' action='CREATE' fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanDeleteSamples({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard module='SAMPLE' action='DELETE' fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanManageUsers({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard module='USER' action='VIEW' fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
