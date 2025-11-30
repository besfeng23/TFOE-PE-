'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
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
import { Skeleton } from '../ui/skeleton';

const unauthenticatedRoutes = ['/login', '/signup'];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isUserLoading } = useAuthUser();

  if (unauthenticatedRoutes.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {children}
      </div>
    );
  }

  if (isUserLoading) {
    return (
       <div className="flex min-h-screen items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Logo className="h-16 w-16 text-primary animate-pulse" />
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
        className="border-sidebar-border"
      >
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8 text-sidebar-primary" />
            <div className="flex flex-col">
              <h2
                className="font-headline text-lg font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden"
              >
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

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg font-semibold">
              {pathname.startsWith('/documents') ? 'Documents' 
               : pathname.startsWith('/applications') ? 'Applications'
               : pathname.startsWith('/analytics') ? 'Analytics'
               : pathname.startsWith('/events') ? 'Events & Programs'
               : pathname.startsWith('/messages') ? 'Messages'
               : pathname.startsWith('/tasks') ? 'Tasks'
               : pathname.startsWith('/settings') ? 'Settings'
               : pathname.startsWith('/profile') ? 'Profile'
               : 'Dashboard'}
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
