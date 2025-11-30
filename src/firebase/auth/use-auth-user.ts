'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

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

export function useAuthUser() {
  const { user, isUserLoading, userError } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  return {
    user,
    profile,
    isUserLoading,
    isProfileLoading,
    error: userError || profileError,
  };
}
