'use client';

import { useAuthUser } from '@/firebase/auth/use-auth-user';
import { usePathname } from 'next/navigation';

const AUTH_ROUTES: string[] = [];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // useAuthUser({
  //   redirectTo: isAuthRoute ? '/' : '/login',
  //   redirectIfFound: isAuthRoute,
  // });

  return <>{children}</>;
}
