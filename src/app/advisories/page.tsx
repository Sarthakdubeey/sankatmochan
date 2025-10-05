
'use client';

import type { ApiStatus } from '@/app/types/notification';
import { Plug, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/advisories/Header';
import { NotificationBar } from '@/components/advisories/NotificationBar';


const apiStatuses: ApiStatus[] = [
    {
        name: 'India Meteorological Department',
        description: 'Provides official weather forecasts, warnings, and meteorological data for India.',
        status: 'connected',
        lastUpdate: new Date().toISOString()
    },
    {
        name: 'National Disaster Management Authority',
        description: 'Issues alerts for natural disasters and emergencies across India.',
        status: 'connected',
        lastUpdate: new Date().toISOString()
    },
    {
        name: 'Google Weather',
        description: 'Provides global weather data and severe weather alerts.',
        status: 'connected',
        lastUpdate: new Date().toISOString()
    }
];

export default function AdvisoriesPage() {
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] p-4 text-white -m-8">
      <div className="container mx-auto">
        <Header />

        <NotificationBar />

        <div className="bg-black/30 rounded-2xl p-5 backdrop-blur-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><Plug /> API Integration Status</h2>
            <p className="opacity-90 mb-6">This system integrates with multiple weather and disaster management APIs to provide real-time alerts.</p>
            <div className="grid md:grid-cols-3 gap-6">
                {apiStatuses.map(api => (
                     <div key={api.name} className="bg-white/10 rounded-xl p-5 hover:-translate-y-1 transition-transform">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><CloudSun /> {api.name}</h3>
                        <p className="opacity-90 mb-4 text-sm">{api.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className={cn("w-2.5 h-2.5 rounded-full", api.status === 'connected' ? 'bg-green-400' : 'bg-red-400')}></div>
                            <span className="capitalize">{api.status}</span> - <span className="opacity-80">Receiving live data</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
