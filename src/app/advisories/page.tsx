
'use client';

import { cn } from '@/lib/utils';
import { Header } from '@/components/advisories/Header';
import { NotificationBar } from '@/components/advisories/NotificationBar';
import { ApiStatus } from '@/components/advisories/ApiStatus';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCw, Volume2, VolumeX, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/useNotifications';


export default function AdvisoriesPage() {
  const { toast } = useToast();
  const {
    notifications,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    refreshNotifications,
    clearNotifications,
  } = useNotifications();
  
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

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] p-4 text-white -m-8">
      <div className="container mx-auto">
        <Header />
        <div className="bg-black/40 rounded-2xl p-4 mb-8 backdrop-blur-lg shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-3 border-b border-white/20">
            <div className="text-2xl font-semibold flex items-center gap-3 mb-4 md:mb-0">
              <Bell className="text-yellow-400" /> Active Weather Alerts
              {notifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
                <Button onClick={handleRefresh} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                    {soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                    Sound {soundEnabled ? 'On' : 'Off'}
                </Button>
                <Button onClick={handleClear} variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" disabled={notifications.length === 0}>
                    <Trash className="mr-2 h-4 w-4" /> Clear All
                </Button>
            </div>
          </div>
          <NotificationBar />
        </div>
        <ApiStatus />
      </div>
    </div>
  );
}
