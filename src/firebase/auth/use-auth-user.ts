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
    // For anonymous users, we don't expect a profile, but the hook needs a valid path.
    // We can point to a non-existent document or handle it based on isAnonymous flag.
    // If you create profiles for anonymous users, this logic might change.
    return doc(firestore, 'userProfiles', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (isUserLoading) return; // Don't do anything while loading

    // If redirectIfFound is set (e.g., on login/signup pages),
    // redirect if the user is found AND they are not an anonymous user.
    if (options.redirectIfFound && user && !user.isAnonymous) {
      router.push(options.redirectTo || '/');
    }

    // If we are NOT on an auth page (redirectIfFound is false),
    // redirect if the user was NOT found.
    if (!options.redirectIfFound && !user && options.redirectTo) {
        router.push(options.redirectTo);
    }
  }, [user, isUserLoading, router, options.redirectIfFound, options.redirectTo]);


  return {
    user,
    profile: user?.isAnonymous ? { firstName: 'Guest', lastName: 'User', roleId: 'Guest' } as UserProfile : profile,
    isUserLoading,
    isProfileLoading,
    error: userError || profileError,
  };
}
