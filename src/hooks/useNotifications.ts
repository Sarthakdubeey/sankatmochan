
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification } from '@/app/types/notification';

// This function fetches real data from the public weather.gov API
const fetchRealNotifications = async (): Promise<Notification[]> => {
  try {
    // Fetch active alerts for a sample area (we'll use a US zone for this public API)
    const response = await fetch('https://api.weather.gov/alerts/active?zone=CAZ548'); // San Diego County Coastal Areas
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    // Parse the GeoJSON response into our Notification format
    const parsedNotifications: Notification[] = (data.features || []).map((alert: any) => {
      const props = alert.properties;
      let type: Notification['type'] = 'info';
      if (props.severity === 'Severe' || props.severity === 'Extreme') {
        type = 'critical';
      } else if (props.severity === 'Moderate') {
        type = 'warning';
      }

      return {
        id: props.id,
        source: 'Google Weather', // Simulating source for consistency
        message: props.headline,
        timestamp: props.sent || new Date().toISOString(),
        type: type,
        severity: 2, // Placeholder severity
        area: props.areaDesc,
        duration: `Until ${props.expires ? new Date(props.expires).toLocaleString() : 'further notice'}`
      };
    });
    
    return parsedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error("Failed to fetch real notifications:", error);
    // Return an empty array or a fallback error message notification
    return [{
        id: 'error-1',
        source: 'System',
        message: 'Could not connect to the live weather API. Please check your connection or try again later.',
        timestamp: new Date().toISOString(),
        type: 'warning',
        severity: 1,
        area: 'N/A'
    }];
  }
};


/**
 * Hook for managing notifications from a live weather API.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    console.log('Fetching live notifications from weather.gov API...');
    const liveNotifications = await fetchRealNotifications();
    setNotifications(liveNotifications);
    setIsLoading(false);
  }, []);

  // Fetch on initial load
  useEffect(() => {
      fetchNotifications();
  }, [fetchNotifications]);

  const clearNotifications = useCallback(async () => {
    console.log('Clearing notifications...');
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
