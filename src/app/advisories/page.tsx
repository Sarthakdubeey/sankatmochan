
'use client';

import { Header } from '@/components/advisories/Header';
import { NotificationBar } from '@/components/advisories/NotificationBar';
import { ApiStatus } from '@/components/advisories/ApiStatus';
import { useState, useEffect } from 'react';

export default function AdvisoriesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8">
      <Header />
      <NotificationBar isClient={isClient}/>
      <ApiStatus isClient={isClient} />
    </div>
  );
}
