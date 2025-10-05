
'use client';

import { cn } from '@/lib/utils';
import { Header } from '@/components/advisories/Header';
import { NotificationBar } from '@/components/advisories/NotificationBar';
import { ApiStatus } from '@/components/advisories/ApiStatus';


export default function AdvisoriesPage() {
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] p-4 text-white -m-8">
      <div className="container mx-auto">
        <Header />
        <NotificationBar />
        <ApiStatus />
      </div>
    </div>
  );
}
