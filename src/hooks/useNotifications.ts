
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification } from '@/app/types/notification';

const mockNotifications: Notification[] = [
  {
    id: '1',
    source: 'IMD',
    message: 'Cyclone Watch issued for the east coast. Expected landfall in 48 hours.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'critical',
    severity: 3,
    area: 'Odisha, Andhra Pradesh',
    duration: 'Next 72 hours',
  },
  {
    id: '2',
    source: 'NDMA',
    message: 'Heavy rainfall warning for western ghats. Risk of landslides.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'warning',
    severity: 2,
    area: 'Kerala, Karnataka',
  },
  {
    id: '3',
    source: 'Google Weather',
    message: 'Heatwave conditions likely to continue in North India.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    type: 'info',
    severity: 1,
    area: 'Delhi, Rajasthan, UP',
    duration: 'Until Friday',
  },
];

const generateRandomNotifications = () => {
    const sources: Notification['source'][] = ['IMD', 'NDMA', 'Google Weather'];
    const types: Notification['type'][] = ['info', 'warning', 'critical'];
    const messages = [
        "Thunderstorm with lightning expected in the afternoon.",
        "River levels are rising, monitor local updates.",
        "Strong surface winds predicted for the coastal areas.",
        "New low-pressure area forming over the Arabian Sea.",
        "Air quality index has reached 'Severe' category."
    ];
    
    return messages.slice(0, Math.floor(Math.random() * 3) + 2).map((msg, i) => ({
        id: `${Date.now()}-${i}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        message: msg,
        timestamp: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        severity: Math.floor(Math.random() * 3) + 1,
        area: 'Various locations'
    }));
}


/**
 * Placeholder hook for managing notifications.
 * This placeholder simulates fetching data from external weather APIs.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    console.log('Simulating: Fetching notifications...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNotifications(generateRandomNotifications());
    setIsLoading(false);
  }, []);

  // Fetch on initial load
  useEffect(() => {
      fetchNotifications();
  }, [fetchNotifications]);

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
