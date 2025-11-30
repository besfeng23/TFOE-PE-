'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '../icons/logo';
import { SidebarNav } from './sidebar-nav';
import { UserNav } from './user-nav';
import { useAuthUser } from '@/firebase';

const unauthenticatedRoutes = ['/login', '/signup'];

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/documents': 'Documents',
  '/applications': 'Applications',
  '/analytics': 'Analytics',
  '/events': 'Events & Programs',
  '/tasks': 'Tasks',
  '/messages': 'Messages',
  '/settings': 'Settings',
  '/profile': 'Profile'
};

const getPageTitle = (pathname: string): string => {
  for (const path in pageTitles) {
    if (pathname.startsWith(path) && path !== '/') {
        return pageTitles[path];
    }
  }
  return pageTitles['/'] ?? 'Dashboard';
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useAuthUser();

  const isUnauthenticatedRoute = unauthenticatedRoutes.includes(pathname);
  const pageTitle = getPageTitle(pathname);

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
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        {children}
      </div>
    );
  }

  if (isUserLoading) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
            <Logo className="h-16 w-16 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading Portal...</p>
         </div>
       </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8 text-sidebar-primary" />
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                Eagles Nest
              </h2>
              <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                TFOE-PE
              </p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarNav />
        </SidebarContent>

        <SidebarFooter>
          <UserNav isSidebar={true} />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg font-semibold">
              {pageTitle}
            </h1>
          </div>
          <div className="hidden md:block">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
