'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser
} from '@/lib/storage';
import type { LoginRequest, UserResponse } from '@/types/api';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials);

      // Store token and user data
      setToken(response.token);
      setStoredUser(response.user);
      setUser(response.user);

      toast.success('Đăng nhập thành công!');
      router.push('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đăng nhập thất bại';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.success('Đã đăng xuất');
    router.push('/');
  };

  const hasPermission = (module: string, action: string): boolean => {
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
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
