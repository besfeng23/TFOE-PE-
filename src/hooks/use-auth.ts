'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { type UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function useAuth(options: { redirectTo?: string, redirectIfFound?: boolean } = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setIsLoading(true);
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
            if (sessionUser.is_anonymous) {
                setProfile({
                    id: sessionUser.id,
                    firstName: 'Guest',
                    lastName: 'User',
                    roleId: 'Guest',
                    email: 'guest@example.com'
                });
            } else {
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                if (error) {
                    throw error;
                }
                setProfile(data as UserProfile);
            }
        } else {
          setProfile(null);
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    });

    // Initial check
    (async () => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);

            if (sessionUser) {
                 if (sessionUser.is_anonymous) {
                    setProfile({
                        id: sessionUser.id,
                        firstName: 'Guest',
                        lastName: 'User',
                        roleId: 'Guest',
                        email: 'guest@example.com'
                    });
                } else {
                    const { data, error } = await supabase
                        .from('members')
                        .select('*')
                        .eq('id', sessionUser.id)
                        .single();

                    if (error) {
                        throw error;
                    }
                    setProfile(data as UserProfile);
                }
            } else {
                setProfile(null);
            }
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    })();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router, options.redirectIfFound, options.redirectTo]);

  useEffect(() => {
    if (isLoading) return;

    const hasUser = !!user;

    if (options.redirectIfFound && hasUser) {
      // router.push(options.redirectTo || '/');
    }

    if (!options.redirectIfFound && !hasUser) {
        // router.push(options.redirectTo || '/login');
    }

  }, [user, isLoading, router, options.redirectIfFound, options.redirectTo]);


  return {
    user,
    profile,
    isLoading,
    error,
  };
}
