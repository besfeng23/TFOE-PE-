
'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Logo } from '../icons/logo';
import { UserNav } from './user-nav';
import { useAuthUser } from '@/firebase';
import { MainNav } from './main-nav';
import { AiChatbot } from './ai-chatbot';

const unauthenticatedRoutes = ['/login', '/signup'];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isUserLoading } = useAuthUser();

  const isUnauthenticatedRoute = unauthenticatedRoutes.includes(pathname);

  if (isUserLoading && !isUnauthenticatedRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-16 w-16 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading Portal...</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticatedRoute) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
        {children}
        <AiChatbot />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="hidden font-bold sm:inline-block font-headline">
                Eagles Nest
              </span>
            </Link>
            <MainNav />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-10">
            {children}
        </div>
      </main>
      <AiChatbot />
    </div>
  );
}
