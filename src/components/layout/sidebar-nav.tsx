'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Calendar,
  ClipboardPenLine,
  FileText,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  {
    href: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    match: (pathname: string) => pathname === '/',
  },
  {
    href: '/documents',
    icon: FileText,
    label: 'Documents',
    match: (pathname: string) => pathname.startsWith('/documents'),
  },
  {
    href: '/applications',
    icon: ClipboardPenLine,
    label: 'Applications',
    match: (pathname: string) => pathname.startsWith('/applications'),
  },
  {
    href: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
    match: (pathname: string) => pathname.startsWith('/analytics'),
  },
  {
    href: '/events',
    icon: Calendar,
    label: 'Events',
    match: (pathname: string) => pathname.startsWith('/events'),
  },
  {
    href: '/tasks',
    icon: ListTodo,
    label: 'Tasks',
    match: (pathname: string) => pathname.startsWith('/tasks'),
  },
  {
    href: '/messages',
    icon: MessageCircle,
    label: 'Messages',
    match: (pathname: string) => pathname.startsWith('/messages'),
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={item.match(pathname)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/settings">
            <SidebarMenuButton
              isActive={pathname.startsWith('/settings')}
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
