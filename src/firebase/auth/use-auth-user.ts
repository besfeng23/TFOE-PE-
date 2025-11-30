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
    if (isUserLoading) return;

    if (options.redirectIfFound && user) {
      router.push(options.redirectTo || '/');
    }

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
