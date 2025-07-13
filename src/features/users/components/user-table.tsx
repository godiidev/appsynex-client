'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Edit, Trash, User, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User as UserType } from '@/types/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useDeleteUser } from '@/hooks/use-api';
import { PermissionGuard } from '@/components/auth/permission-guard';

interface UserTableProps {
  data: UserType[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function UserTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  isLoading
}: UserTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteUser();

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      case 'MANAGER':
        return 'secondary';
      case 'STAFF':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'username',
      header: 'Người dùng',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
            </Avatar>
            <div>
              <div className='font-medium'>{user.username}</div>
              <div className='text-muted-foreground text-sm'>{user.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'roles',
      header: 'Vai trò',
      cell: ({ row }) => {
        const roles = row.original.roles;
        return (
          <div className='flex flex-wrap gap-1'>
            {roles.map((role) => (
              <Badge
                key={role.id}
                variant={getRoleColor(role.role_name) as any}
              >
                {role.role_name}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: 'phone',
      header: 'Điện thoại',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone ? (
          <span className='font-mono text-sm'>{phone}</span>
        ) : (
          <span className='text-muted-foreground'>N/A</span>
        );
      }
    },
    {
      accessorKey: 'account_status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.getValue('account_status') as string;
        return (
          <Badge variant={getStatusColor(status) as any}>
            {status === 'active'
              ? 'Hoạt động'
              : status === 'inactive'
                ? 'Tạm ngưng'
                : status === 'suspended'
                  ? 'Bị khóa'
                  : status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'last_login',
      header: 'Đăng nhập cuối',
      cell: ({ row }) => {
        const lastLogin = row.getValue('last_login') as string;
        return lastLogin ? (
          <span className='text-sm'>
            {format(new Date(lastLogin), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </span>
        ) : (
          <span className='text-muted-foreground'>Chưa đăng nhập</span>
        );
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Ngày tạo',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return (
          <span className='text-sm'>
            {format(new Date(date), 'dd/MM/yyyy', { locale: vi })}
          </span>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        const handleEdit = () => {
          router.push(`/dashboard/users/${user.id}/edit`);
        };

        const handleDelete = async () => {
          if (
            window.confirm(
              `Bạn có chắc chắn muốn xóa người dùng ${user.username}?`
            )
          ) {
            try {
              await deleteMutation.mutateAsync(user.id);
            } catch (error) {
              // Error is handled by the mutation
            }
          }
        };

        const handleViewProfile = () => {
          router.push(`/dashboard/users/${user.id}`);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Mở menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>

              <PermissionGuard module='USER' action='VIEW'>
                <DropdownMenuItem onClick={handleViewProfile}>
                  <User className='mr-2 h-4 w-4' />
                  Xem hồ sơ
                </DropdownMenuItem>
              </PermissionGuard>

              <PermissionGuard module='USER' action='UPDATE'>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className='mr-2 h-4 w-4' />
                  Chỉnh sửa
                </DropdownMenuItem>
              </PermissionGuard>

              <PermissionGuard module='USER' action='ASSIGN_ROLES'>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/users/${user.id}/roles`)
                  }
                >
                  <Shield className='mr-2 h-4 w-4' />
                  Phân quyền
                </DropdownMenuItem>
              </PermissionGuard>

              <PermissionGuard module='USER' action='DELETE'>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className='text-destructive focus:text-destructive'
                  disabled={deleteMutation.isPending}
                >
                  <Trash className='mr-2 h-4 w-4' />
                  {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize)
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className='bg-muted h-6 animate-pulse rounded' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-2'>
          <div className='text-muted-foreground flex-1 text-sm'>
            Hiển thị {(currentPage - 1) * pageSize + 1} đến{' '}
            {Math.min(currentPage * pageSize, totalItems)} trong tổng số{' '}
            {totalItems} người dùng
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <div className='flex items-center space-x-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
