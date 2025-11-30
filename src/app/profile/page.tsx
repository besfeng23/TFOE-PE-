'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthUser, updateDocumentNonBlocking } from '@/firebase';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, isUserLoading, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setContactInfo(profile.contactInfo || '');
    }
  }, [profile]);
  
  const handleSaveChanges = () => {
    if (!user || !firestore) return;
    setIsSaving(true);
    const profileRef = doc(firestore, 'userProfiles', user.uid);
    updateDocumentNonBlocking(profileRef, {
      firstName,
      lastName,
      contactInfo,
    });
    
    // Non-blocking, so we can give feedback immediately
    toast({
        title: "Profile Updated",
        description: "Your changes have been queued for saving.",
    });
    setIsSaving(false);
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Profile</CardTitle>
        <CardDescription>View and edit your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {profile?.idPhotoUrl && (
                <AvatarImage src={profile.idPhotoUrl} alt="User avatar" />
              )}
              <AvatarFallback>{profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{profile?.firstName} {profile?.lastName}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
            </>
          ) : (
             <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membershipNumber">Membership Number</Label>
                  <Input id="membershipNumber" value={profile?.membershipNumber || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user?.email || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input id="contact" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile?.roleId || ''} readOnly />
                </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isLoading || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
