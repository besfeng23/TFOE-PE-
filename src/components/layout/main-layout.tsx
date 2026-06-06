
'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Logo } from '../icons/logo';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/use-auth';
import { AiChatbot } from './ai-chatbot';
import { Button } from '../ui/button';
import { CommandMenu } from './command-menu';
import { Search } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAuth();
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-24 w-24 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-10 w-10" />
              <span className="hidden font-bold sm:inline-block font-headline">
                Eagles Command Center
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
             <Button
              variant="outline"
              className="w-full justify-start text-sm text-muted-foreground md:w-64"
              onClick={() => setOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search and navigate...</span>
              <span className="inline-flex lg:hidden">Navigate...</span>
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-10">
            {children}
        </div>
      </main>
      <AiChatbot />
      <CommandMenu open={open} setOpen={setOpen} />
    </div>
  );
}
