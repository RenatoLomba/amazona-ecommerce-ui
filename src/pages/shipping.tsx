import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../hooks/useUser';

export default function Shipping() {
  const router = useRouter();
  const { loggedUser } = useUser();

  if (!loggedUser) {
    router.push('/login?redirect=shipping');
  }

  return <div>Shipping</div>;
}
