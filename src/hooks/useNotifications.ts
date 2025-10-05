// app/hooks/useNotifications.ts
'use client';

import { useState, useCallback } from 'react';
import { Notification } from '@/app/types/notification';

/**
 * Placeholder hook for managing notifications.
 * The original implementation relied on API routes that cannot be created at this time.
 * This placeholder allows the UI to be built out while deferring the data connection.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    console.log('Placeholder: Fetching notifications...');
    // In a real implementation, this would fetch from a data source.
    setNotifications([]);
    setIsLoading(false);
  }, []);

  const clearNotifications = useCallback(async () => {
    console.log('Placeholder: Clearing notifications...');
    setNotifications([]);
  }, []);

  return {
    notifications,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    refreshNotifications: fetchNotifications,
    clearNotifications,
  };
};
