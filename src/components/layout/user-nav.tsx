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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

interface UserNavProps {
  isSidebar?: boolean;
}

export function UserNav({ isSidebar = false }: UserNavProps) {
  const userProfileImage = PlaceHolderImages.find(
    (img) => img.id === 'user-profile-1'
  );

  const triggerContent = (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {userProfileImage && (
          <AvatarImage
            src={userProfileImage.imageUrl}
            alt="User avatar"
            data-ai-hint={userProfileImage.imageHint}
          />
        )}
        <AvatarFallback>EN</AvatarFallback>
      </Avatar>
      <div
        className={`text-left ${
          isSidebar
            ? 'group-data-[collapsible=icon]:hidden'
            : 'hidden md:block'
        }`}
      >
        <p className="text-sm font-medium leading-none">Eagle Secretary</p>
        <p className="text-xs leading-none text-muted-foreground">
          secretary@tfoepe.org
        </p>
      </div>
    </div>
  );

  if (isSidebar) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start p-2"
          >
            {triggerContent}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount side="top">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Eagle Secretary</p>
                <p className="text-xs leading-none text-muted-foreground">
                  secretary@tfoepe.org
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
            <Link href="/login">
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {userProfileImage && (
              <AvatarImage
                src={userProfileImage.imageUrl}
                alt="User avatar"
                data-ai-hint={userProfileImage.imageHint}
              />
            )}
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Eagle Secretary</p>
            <p className="text-xs leading-none text-muted-foreground">
              secretary@tfoepe.org
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
        <Link href="/login">
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
