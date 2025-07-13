// src/components/theme-selector.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

const themes = [
  { name: 'Default', value: 'default' },
  { name: 'New York', value: 'new-york' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
  { name: 'Rose', value: 'rose' },
  { name: 'Slate', value: 'slate' },
  { name: 'Stone', value: 'stone' },
  { name: 'Violet', value: 'violet' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Zinc', value: 'zinc' }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='sm'>
        <Palette className='h-4 w-4' />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Palette className='h-4 w-4' />
          <span className='sr-only'>Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className='cursor-pointer'
          >
            <div className='flex w-full items-center justify-between'>
              <span>{themeOption.name}</span>
              {theme === themeOption.value && (
                <div className='bg-primary h-2 w-2 rounded-full' />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
