'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, profile, isUserLoading, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const isAnonymousUser = user?.isAnonymous;

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setContactInfo(profile.contactInfo || '');
    }
  }, [profile]);
  
  const handleSaveChanges = async () => {
    if (!user || !firestore || isAnonymousUser) {
        toast({
            variant: "destructive",
            title: "Action Not Allowed",
            description: "Guest users cannot update profile information.",
        });
        return;
    };

    setIsSaving(true);
    const profileRef = doc(firestore, 'userProfiles', user.uid);
    
    updateDocumentNonBlocking(profileRef, {
        firstName,
        lastName,
        contactInfo,
    });
    
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
    });
    
    setIsSaving(false);
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  const renderLoadingSkeletons = () => (
    <>
        <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-48" />
            </div>
        </div>
        <Separator/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
            <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
            <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
            <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
            <div className="space-y-2"><Skeleton className="h-5 w-20"/><Skeleton className="h-10 w-full"/></div>
        </div>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Profile</CardTitle>
        <CardDescription>View and edit your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? renderLoadingSkeletons() : (
          <>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {profile?.idPhotoUrl ? (
                  <AvatarImage src={profile.idPhotoUrl} alt="User avatar" data-ai-hint="person portrait"/>
                ) : (
                   <AvatarImage src="https://picsum.photos/seed/1/200/200" alt="User avatar" data-ai-hint="person portrait"/>
                )}
                <AvatarFallback>{profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{profile?.firstName} {profile?.lastName}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || "guest@example.com"}</p>
                <Button variant="outline" size="sm" className="mt-2" disabled={isAnonymousUser}>Change Photo</Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isAnonymousUser}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isAnonymousUser}/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || 'N/A'} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Info</Label>
                <Input id="contact" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} disabled={isAnonymousUser}/>
              </div>
            </div>

             <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="membershipNumber">Membership Number</Label>
                  <Input id="membershipNumber" value={profile?.membershipNumber || 'N/A'} readOnly disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile?.roleId || 'Guest'} readOnly disabled />
                </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveChanges} disabled={isLoading || isSaving || isAnonymousUser}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
