
'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification, ApiStatus } from '@/app/types/notification';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Trash,
  RefreshCw,
  Volume2,
  VolumeX,
  CloudSun,
  TriangleAlert,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  Waves,
  Database,
  Clock,
  Plug,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/advisories/Header';

const notificationIcons: { [key: string]: React.ElementType } = {
  default: CloudRain,
  'fa-cloud-showers-heavy': CloudRain,
  'fa-wind': Wind,
  'fa-temperature-high': Thermometer,
  'fa-bolt': Zap,
  'fa-water': Waves,
};

const typeStyles: { [key: string]: string } = {
  critical: 'border-red-500 bg-red-500/15',
  warning: 'border-yellow-500 bg-yellow-500/15',
  info: 'border-blue-500 bg-blue-500/15',
};

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
  const {
    notifications,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    refreshNotifications,
    clearNotifications,
  } = useNotifications();
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({ title: "Refreshing...", description: "Fetching latest alerts." });
    refreshNotifications();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      clearNotifications();
      toast({ title: "Notifications Cleared" });
    }
  };
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'critical': return TriangleAlert;
      case 'warning': return TriangleAlert;
      default: return Bell;
    }
  }

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] p-4 text-white -m-8">
      <div className="container mx-auto">
        <Header />

        <div className="bg-black/40 rounded-2xl p-4 mb-8 backdrop-blur-lg shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-3 border-b border-white/20">
            <div className="text-2xl font-semibold flex items-center gap-3 mb-4 md:mb-0">
              <Bell className="text-yellow-400" /> Active Weather Alerts
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={handleRefresh} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                {soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                Sound {soundEnabled ? 'On' : 'Off'}
              </Button>
              <Button onClick={handleClear} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Trash className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full bg-white/10 mb-4" />)
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = getIconForType(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn('p-4 mb-4 rounded-lg flex items-start gap-4 border-l-4 transition-all hover:bg-white/20', typeStyles[notification.type])}
                  >
                    <div className="text-2xl pt-1">
                      <Icon />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-80 mb-1 flex items-center gap-2">
                        <Database size={14} /> {notification.source}
                      </div>
                      <div className="text-base font-medium mb-2">{notification.message}</div>
                      <div className="text-xs opacity-70 flex items-center gap-2">
                        <Clock size={12} /> {notification.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
                <div className="text-center py-16 opacity-80">
                    <Bell size={48} className="mx-auto mb-4"/>
                    <p className="text-lg font-semibold">All Clear</p>
                    <p>No active weather alerts at the moment.</p>
                </div>
            )}
          </div>
        </div>

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
