'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserProfile } from '@/lib/types';


export function useAuthUser(options: { redirectTo?: string, redirectIfFound?: boolean } = {}) {
  const { user, isUserLoading, userError } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore || user.isAnonymous) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    const hasUser = !!user;
    const hasProfile = !!profile || user?.isAnonymous;

    if (options.redirectIfFound && hasUser && hasProfile) {
      router.push(options.redirectTo || '/');
    }

    if (!options.redirectIfFound && (!hasUser || userError)) {
        router.push(options.redirectTo || '/login');
    }
    
  }, [user, profile, isUserLoading, isProfileLoading, userError, router, options.redirectIfFound, options.redirectTo]);


  const getProfile = () => {
    if (user?.isAnonymous) {
      return { 
        id: user.uid,
        firstName: 'Guest', 
        lastName: 'User', 
        roleId: 'Guest',
        email: 'guest@example.com'
      } as UserProfile;
    }
    return profile;
  }


  return {
    user,
    profile: getProfile(),
    isUserLoading,
    isProfileLoading,
    error: userError || profileError,
  };
}
