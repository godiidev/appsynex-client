'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, CreditCard, Users } from 'lucide-react';

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Transform auth user to match UserAvatarProfile interface
  const userForAvatar = {
    imageUrl: user.avatar,
    fullName: user.username,
    emailAddresses: [{ emailAddress: user.email }]
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <UserAvatarProfile user={userForAvatar} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{user.username}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
            {user.roles && user.roles.length > 0 && (
              <p className='text-muted-foreground text-xs leading-none'>
                {user.roles.join(', ')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/profile')}
            className='cursor-pointer'
          >
            <User className='mr-2 h-4 w-4' />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/settings')}
            className='cursor-pointer'
          >
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/billing')}
            className='cursor-pointer'
          >
            <CreditCard className='mr-2 h-4 w-4' />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/team')}
            className='cursor-pointer'
          >
            <Users className='mr-2 h-4 w-4' />
            Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='cursor-pointer text-red-600 focus:text-red-600'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
