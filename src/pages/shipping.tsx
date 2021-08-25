import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../hooks/useUser';

export default function Shipping() {
  const router = useRouter();
  const { loggedUser } = useUser();

  useEffect(() => {
    if (!loggedUser) {
      router.push('/login?redirect=shipping');
    }
  }, []);

  return <div>Shipping</div>;
}
