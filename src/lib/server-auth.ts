//src/lib/server-auth.ts - Server-side authentication utilities with async cookies
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Helper function to get token from server-side cookies
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('appsynex_token')?.value || null;
  } catch (error) {
    console.log('Could not get server token:', error);
    return null;
  }
}

// Helper function to check if user is authenticated on server-side
export async function requireAuth(): Promise<string> {
  const token = await getServerToken();

  if (!token) {
    redirect('/auth/sign-in');
  }

  return token;
}

// Helper function to get user data from server-side cookies
export async function getServerUser(): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const userData = cookieStore.get('appsynex_user')?.value;
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.log('Could not get server user:', error);
    return null;
  }
}

// Helper function to check if user has specific permission
export async function hasServerPermission(
  module: string,
  action: string
): Promise<boolean> {
  try {
    const user = await getServerUser();
    if (!user || !user.roles) return false;

    // Super admin has all permissions
    if (user.roles.includes('SUPER_ADMIN')) return true;

    // Admin has most permissions except some system functions
    if (user.roles.includes('ADMIN')) {
      const restrictedActions = ['BACKUP', 'RESTORE', 'MANAGE_SETTINGS'];
      if (module === 'SYSTEM' && restrictedActions.includes(action)) {
        return false;
      }
      return true;
    }

    // Manager permissions
    if (user.roles.includes('MANAGER')) {
      const managerPermissions: Record<string, string[]> = {
        SAMPLE: ['VIEW', 'CREATE', 'UPDATE', 'TRACK'],
        USER: ['VIEW'],
        PRODUCT_CATEGORY: ['VIEW'],
        CUSTOMER: ['VIEW', 'CREATE', 'UPDATE'],
        ORDER: ['VIEW', 'CREATE', 'UPDATE'],
        WAREHOUSE: ['VIEW'],
        REPORT: ['VIEW', 'CREATE']
      };

      return managerPermissions[module]?.includes(action) || false;
    }

    // Staff permissions
    if (user.roles.includes('STAFF')) {
      const staffPermissions: Record<string, string[]> = {
        SAMPLE: ['VIEW', 'CREATE', 'UPDATE'],
        PRODUCT_CATEGORY: ['VIEW'],
        CUSTOMER: ['VIEW'],
        ORDER: ['VIEW'],
        WAREHOUSE: ['VIEW'],
        REPORT: ['VIEW']
      };

      return staffPermissions[module]?.includes(action) || false;
    }

    return false;
  } catch (error) {
    console.log('Error checking server permission:', error);
    return false;
  }
}

// Helper function to require specific permission
export async function requirePermission(
  module: string,
  action: string
): Promise<void> {
  const hasPermission = await hasServerPermission(module, action);

  if (!hasPermission) {
    redirect('/auth/sign-in?error=insufficient_permissions');
  }
}
