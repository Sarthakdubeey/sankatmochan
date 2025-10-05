
'use client';

import { Header } from '@/components/advisories/Header';
import { NotificationBar } from '@/components/advisories/NotificationBar';
import { ApiStatus } from '@/components/advisories/ApiStatus';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect }from 'react';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <Header />
        <NotificationBar />
        <ApiStatus />

        <footer className="text-center mt-12 opacity-70">
            <p>
            Real-Time Weather Alert System &copy; 2024 | 
            Data sourced from IMD, NDMA, and Google Weather APIs
            </p>
        </footer>
      </div>
    </div>
  );
}
