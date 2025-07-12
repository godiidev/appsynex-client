//src/lib/storage.ts
import Cookies from 'js-cookie';

// Token management
const TOKEN_KEY = 'appsynex_token';
const USER_KEY = 'appsynex_user';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_KEY) || null;
};

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

// User data management
export const getStoredUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userData = Cookies.get(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setStoredUser = (user: any): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Permission helpers
export const hasPermission = (
  userRoles: string[],
  requiredPermissions: string[]
): boolean => {
  // Super admin has all permissions
  if (userRoles.includes('SUPER_ADMIN')) return true;

  // Admin has most permissions except system management
  if (userRoles.includes('ADMIN')) {
    const systemPermissions = [
      'SYSTEM_BACKUP',
      'SYSTEM_RESTORE',
      'SYSTEM_MANAGE_SETTINGS'
    ];
    return !requiredPermissions.some((perm) =>
      systemPermissions.includes(perm)
    );
  }

  // Manager has limited permissions
  if (userRoles.includes('MANAGER')) {
    const managerPermissions = [
      'SAMPLE_VIEW',
      'SAMPLE_CREATE',
      'SAMPLE_UPDATE',
      'SAMPLE_TRACK',
      'USER_VIEW',
      'PRODUCT_CATEGORY_VIEW',
      'CUSTOMER_VIEW',
      'ORDER_VIEW',
      'ORDER_CREATE',
      'ORDER_UPDATE',
      'WAREHOUSE_VIEW',
      'REPORT_VIEW'
    ];
    return requiredPermissions.every((perm) =>
      managerPermissions.includes(perm)
    );
  }

  // Staff has basic permissions
  if (userRoles.includes('STAFF')) {
    const staffPermissions = [
      'SAMPLE_VIEW',
      'SAMPLE_CREATE',
      'SAMPLE_UPDATE',
      'PRODUCT_CATEGORY_VIEW',
      'CUSTOMER_VIEW',
      'ORDER_VIEW',
      'WAREHOUSE_VIEW',
      'REPORT_VIEW'
    ];
    return requiredPermissions.every((perm) => staffPermissions.includes(perm));
  }

  return false;
};

export const canAccess = (
  userRoles: string[],
  module: string,
  action: string
): boolean => {
  const permission = `${module}_${action}`;
  return hasPermission(userRoles, [permission]);
};
