'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipNumber?: string;
    idPhotoUrl?: string;
    contactInfo?: string;
    roleId: string;
}

export function useAuthUser(options: { redirectTo?: string, redirectIfFound?: boolean } = {}) {
  const { user, isUserLoading, userError } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (isUserLoading) return; // Don't do anything while loading

    // If redirectIfFound is set, redirect if the user was found
    if (options.redirectIfFound && user) {
      router.push(options.redirectTo || '/');
    }

    // If redirectIfFound is NOT set, redirect if the user was NOT found
    if (!options.redirectIfFound && !user && options.redirectTo) {
        router.push(options.redirectTo);
    }
  }, [user, isUserLoading, router, options.redirectIfFound, options.redirectTo]);


  return {
    user,
    profile,
    isUserLoading,
    isProfileLoading,
    error: userError || profileError,
  };
}
