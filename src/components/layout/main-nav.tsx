
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  ClipboardPenLine,
  FileText,
  Handshake,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  Receipt,
  Users,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Membership Fees',
    href: '/fees',
    description:
      'Official fee structure for application and annual renewal.',
  },
  {
    title: 'Applications',
    href: '/applications',
    description:
      'Submit and manage new membership applications.',
  },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), pathname === '/' ? 'bg-accent text-accent-foreground' : '')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="mr-2 h-4 w-4" /> Directory
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem href="/members" title="Members Directory">
                Browse, search, and manage all member profiles.
              </ListItem>
              <ListItem href="/partnerships" title="Partnerships">
                Manage corporate, NGO, and private entity partners.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

         <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FileText className="mr-2 h-4 w-4" /> Operations
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem href="/documents" title="Document Repository">
                Access resolutions, minutes, forms, and financial reports.
              </ListItem>
              <ListItem href="/events" title="Events & Programs">
                 Schedule and manage all official events and meetings.
              </ListItem>
               <ListItem href="/tasks" title="My Tasks">
                Manage your personal to-do list and action items.
              </ListItem>
              <ListItem href="/video" title="Video Studio">
                Generate video clips from text prompts using AI.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

         <NavigationMenuItem>
          <NavigationMenuTrigger>
            <ClipboardPenLine className="mr-2 h-4 w-4" /> Membership
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                    <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    >
                    {component.description}
                    </ListItem>
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <Link href="/analytics" legacyBehavior passHref>
            <NavigationMenuLink 
                className={cn(navigationMenuTriggerStyle(), pathname.startsWith('/analytics') ? 'bg-accent text-accent-foreground' : '')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

         <NavigationMenuItem>
          <Link href="/messages" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname.startsWith('/messages') ? 'bg-accent text-accent-foreground' : '')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
