'use client';

import {
  ChevronUp,
  User2,
  Package,
  Users,
  FolderTree,
  BarChart3,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/providers/auth-provider';
import { PermissionGuard } from '@/components/auth/permission-guard';
import Link from 'next/link';

// Navigation items with permission requirements
const navigation = [
  {
    title: 'Tổng quan',
    url: '/dashboard',
    icon: BarChart3,
    items: []
  },
  {
    title: 'Quản lý mẫu vải',
    icon: Package,
    items: [
      {
        title: 'Danh sách mẫu',
        url: '/dashboard/samples',
        permission: { module: 'SAMPLE', action: 'VIEW' }
      },
      {
        title: 'Thêm mẫu mới',
        url: '/dashboard/samples/new',
        permission: { module: 'SAMPLE', action: 'CREATE' }
      }
    ]
  },
  {
    title: 'Danh mục',
    icon: FolderTree,
    items: [
      {
        title: 'Danh sách danh mục',
        url: '/dashboard/categories',
        permission: { module: 'PRODUCT_CATEGORY', action: 'VIEW' }
      },
      {
        title: 'Thêm danh mục',
        url: '/dashboard/categories/new',
        permission: { module: 'PRODUCT_CATEGORY', action: 'CREATE' }
      }
    ]
  },
  {
    title: 'Quản lý người dùng',
    icon: Users,
    permission: { module: 'USER', action: 'VIEW' },
    items: [
      {
        title: 'Danh sách người dùng',
        url: '/dashboard/users',
        permission: { module: 'USER', action: 'VIEW' }
      },
      {
        title: 'Thêm người dùng',
        url: '/dashboard/users/new',
        permission: { module: 'USER', action: 'CREATE' }
      }
    ]
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    permission: { module: 'SYSTEM', action: 'VIEW' },
    items: [
      {
        title: 'Cài đặt chung',
        url: '/dashboard/settings',
        permission: { module: 'SYSTEM', action: 'VIEW' }
      },
      {
        title: 'Phân quyền',
        url: '/dashboard/permissions',
        permission: { module: 'ROLE', action: 'VIEW' }
      }
    ]
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, hasPermission } = useAuth();
  const { setOpen } = useSidebar();

  const getUserInitials = (username?: string) => {
    if (!username) return 'U';
    return username.slice(0, 2).toUpperCase();
  };

  const getUserRole = () => {
    if (!user?.roles || user.roles.length === 0) return 'User';
    // Show highest role
    if (user.roles.includes('SUPER_ADMIN')) return 'Super Admin';
    if (user.roles.includes('ADMIN')) return 'Admin';
    if (user.roles.includes('MANAGER')) return 'Manager';
    return 'Staff';
  };

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Package className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>AppSynex</span>
                  <span className='truncate text-xs'>Quản lý mẫu vải</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                // Check if user has permission to see main item
                if (item.permission) {
                  const canSee = hasPermission(
                    item.permission.module,
                    item.permission.action
                  );
                  if (!canSee) return null;
                }

                // If no sub-items, render as simple link
                if (!item.items || item.items.length === 0) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url || '#'}
                          onClick={() => setOpen(false)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Filter sub-items based on permissions
                const visibleSubItems = item.items.filter((subItem) => {
                  if (!subItem.permission) return true;
                  return hasPermission(
                    subItem.permission.module,
                    subItem.permission.action
                  );
                });

                // Don't show parent if no visible sub-items
                if (visibleSubItems.length === 0) return null;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <span>
                        <item.icon />
                        <span>{item.title}</span>
                      </span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {visibleSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              onClick={() => setOpen(false)}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {getUserInitials(user?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.username}
                    </span>
                    <span className='truncate text-xs'>{getUserRole()}</span>
                  </div>
                  <ChevronUp className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/profile'>
                    <User2 className='mr-2 h-4 w-4' />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
