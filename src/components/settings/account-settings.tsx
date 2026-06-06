
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AccountSettings() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Settings</CardTitle>
            <CardDescription>
              Manage your personal information and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.user_metadata?.full_name || 'User'} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || 'guest@example.com'} disabled />
            </div>
            <Link href="/profile">
                <Button>Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>
    )
}
