
'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCw, Volume2, VolumeX, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const NotificationBar = () => {
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


  return (
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

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full bg-white/10" />)
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🌤️</div>
            <p>No active weather alerts</p>
            <p className="text-sm">All clear for now!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};
