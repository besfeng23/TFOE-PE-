'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAuthUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

interface UserNavProps {
  isSidebar?: boolean;
}

export function UserNav({ isSidebar = false }: UserNavProps) {
  const { user, profile } = useAuthUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
      });
    }
  };

  const userInitial = profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U';
  const userInitialLast = profile?.lastName?.charAt(0) || '';


  const triggerContent = (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {profile?.idPhotoUrl ? (
          <AvatarImage
            src={profile.idPhotoUrl}
            alt="User avatar"
          />
        ) : profile?.avatarUrl ? (
          <AvatarImage
            src={profile.avatarUrl}
            alt="User avatar"
          />
        ) : null}
        <AvatarFallback>{userInitial}{userInitialLast}</AvatarFallback>
      </Avatar>
      <div
        className={`text-left ${
          isSidebar
            ? 'group-data-[collapsible=icon]:hidden'
            : 'hidden md:block'
        }`}
      >
        <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </div>
  );

  const dropdownContent = (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
    </>
  );

  if (isSidebar) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {triggerContent}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount side="top">
          {dropdownContent}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
             {profile?.idPhotoUrl ? (
              <AvatarImage
                src={profile.idPhotoUrl}
                alt="User avatar"
              />
            ) : profile?.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt="User avatar"
              />
            ) : null}
            <AvatarFallback>{userInitial}{userInitialLast}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {dropdownContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
