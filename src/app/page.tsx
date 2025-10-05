
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect }from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <Card>
            <CardHeader>
                <CardTitle>Welcome to Sankat Mochan</CardTitle>
                <CardDescription>Your disaster management assistant.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Navigate to the various sections of the app using the sidebar.</p>
                <Button asChild>
                    <Link href="/advisories">View Weather Advisories</Link>
                </Button>
            </CardContent>
        </Card>

        <footer className="text-center mt-12 opacity-70">
            <p>
                Sankat Mochan &copy; 2024
            </p>
        </footer>
      </div>
    </div>
  );
}
