'use client';

import * as React from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  FileText,
  Users,
  Handshake,
  ListTodo,
  Video,
  ClipboardPenLine,
  BarChart3,
  MessageCircle,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);
  
  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => navigate('/')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/members')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Members</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/applications')}>
            <ClipboardPenLine className="mr-2 h-4 w-4" />
            <span>5 I's &amp; Applications</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/partnerships')}>
            <Handshake className="mr-2 h-4 w-4" />
            <span>Partnerships</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/documents')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Document Repository</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/events')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Events &amp; Programs</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/tasks')}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>My Tasks</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/video')}>
            <Video className="mr-2 h-4 w-4" />
            <span>Video Studio</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/fees')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Fees</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/analytics')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
           <CommandItem onSelect={() => navigate('/messages')}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
