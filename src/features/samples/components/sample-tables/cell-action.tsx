'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Eye, Trash, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { SampleProduct } from '@/types/api';
import { useDeleteSample } from '@/hooks/use-api';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { toast } from 'sonner';

interface CellActionProps {
  data: SampleProduct;
}

export function CellAction({ data }: CellActionProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const router = useRouter();
  const deleteMutation = useDeleteSample();

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép SKU');
  };

  const onView = () => {
    router.push(`/dashboard/samples/${data.id}`);
  };

  const onEdit = () => {
    router.push(`/dashboard/samples/${data.id}/edit`);
  };

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync(data.id);
      setShowDeleteAlert(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.sku)}>
            <Copy className='mr-2 h-4 w-4' />
            Sao chép SKU
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <PermissionGuard module='SAMPLE' action='VIEW'>
            <DropdownMenuItem onClick={onView}>
              <Eye className='mr-2 h-4 w-4' />
              Xem chi tiết
            </DropdownMenuItem>
          </PermissionGuard>

          <PermissionGuard module='SAMPLE' action='UPDATE'>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </DropdownMenuItem>
          </PermissionGuard>

          <PermissionGuard module='SAMPLE' action='DELETE'>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteAlert(true)}
              className='text-destructive focus:text-destructive'
            >
              <Trash className='mr-2 h-4 w-4' />
              Xóa
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mẫu vải</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu vải <strong>{data.sku}</strong>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
