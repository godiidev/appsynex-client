'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function SearchInput() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Implement search logic here
      console.log('Searching for:', searchValue);
      setOpen(false);
    }
  };

  return (
    <div className='w-full space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64'
          >
            <Search className='mr-2 h-4 w-4' />
            Search...
            <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
              <span className='text-xs'>⌘</span>K
            </kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-0' align='start'>
          <form
            onSubmit={handleSearch}
            className='flex items-center space-x-2 p-4'
          >
            <div className='flex-1'>
              <Input
                placeholder='Search samples, users, categories...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='w-full'
                autoFocus
              />
            </div>
            <Button type='submit' size='sm'>
              <Search className='h-4 w-4' />
            </Button>
          </form>

          {/* Quick search suggestions */}
          <div className='border-t p-2'>
            <div className='text-muted-foreground mb-2 text-xs'>
              Quick actions:
            </div>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => {
                  // Navigate to samples
                  window.location.href = '/dashboard/samples';
                  setOpen(false);
                }}
              >
                <Search className='mr-2 h-3 w-3' />
                Search Samples
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => {
                  // Navigate to users
                  window.location.href = '/dashboard/users';
                  setOpen(false);
                }}
              >
                <Search className='mr-2 h-3 w-3' />
                Search Users
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => {
                  // Navigate to categories
                  window.location.href = '/dashboard/categories';
                  setOpen(false);
                }}
              >
                <Search className='mr-2 h-3 w-3' />
                Search Categories
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
