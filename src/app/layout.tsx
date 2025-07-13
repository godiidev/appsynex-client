// src/app/layout.tsx - Simple layout with theme provider
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/layout/ThemeToggle/theme-provider';
import Providers from '@/components/layout/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AppSynex - Fabric Sample Management',
  description: 'Professional fabric sample management system'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position='bottom-right' />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
