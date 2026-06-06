
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Settings, User } from 'lucide-react';

export function UserNav() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
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
        <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
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
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                </div>
           </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
