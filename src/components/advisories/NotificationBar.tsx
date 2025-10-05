
'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Skeleton } from '@/components/ui/skeleton';

export const NotificationBar = () => {
  const {
    notifications,
    isLoading,
  } = useNotifications();


  return (
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
  );
};
