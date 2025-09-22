'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/client';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = React.useState(false);

  React.useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        const redirect = encodeURIComponent(pathname || '/mypage');
        router.replace(`/login?redirect=${redirect}`);
        return;
      }
      setIsAllowed(true);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}


