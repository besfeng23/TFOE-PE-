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
import { Button } from '../ui/button';
import Link from 'next/link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {children}
      </div>
    );
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

      <SidebarInset className="bg-muted/30">
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

    