
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
import { Globe, Mail, MapPin } from 'lucide-react';
import { Separator } from '../ui/separator';

const unauthenticatedRoutes = ['/login', '/signup'];

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/documents': 'Documents',
  '/applications': 'Applications',
  '/analytics': 'Analytics Dashboard',
  '/events': 'Events & Programs',
  '/tasks': 'Tasks',
  '/messages': 'Messages',
  '/members': 'Members Directory',
  '/settings': 'Settings',
  '/profile': 'My Profile',
  '/fees': 'Membership Fees',
  '/partnerships': 'Partnerships',
  '/ai-assistant': 'AI Assistant',
  '/help': 'Help & Support',
  '/settings/roles': 'Role Management',
};

const getPageTitle = (pathname: string): string => {
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }
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

      <SidebarInset className="bg-background flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg font-semibold truncate">
              {pageTitle}
            </h1>
          </div>
          <div className="hidden md:block">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <footer className="p-4 sm:p-6 border-t bg-background/80">
          <div className="container mx-auto px-0">
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground'>
                  <div className='flex items-start gap-3'>
                      <MapPin className='h-4 w-4 mt-0.5 shrink-0'/>
                      <span>4th Floor Vargas Building, Brgy. West Fairview Compound, Quezon City, Philippines</span>
                  </div>
                   <div className='flex items-start gap-3'>
                      <Mail className='h-4 w-4 mt-0.5 shrink-0'/>
                      <a href="mailto:np@tfoe-pei.org" className='hover:text-primary'>np@tfoe-pei.org</a>
                  </div>
                   <div className='flex items-start gap-3'>
                      <Globe className='h-4 w-4 mt-0.5 shrink-0'/>
                      <a href="https://tfoe-pei.org" target="_blank" rel="noopener noreferrer" className='hover:text-primary'>tfoe-pei.org</a>
                  </div>
              </div>
              <Separator className='my-4'/>
              <p className='text-xs text-center text-muted-foreground/80'>
                © {new Date().getFullYear()} The Fraternal Order of Eagles - Philippine Eagle. All rights reserved.
              </p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
