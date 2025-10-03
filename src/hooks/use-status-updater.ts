
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus } from '@/lib/firebase/status';
import { GeoPoint, serverTimestamp } from 'firebase/firestore';
import { AlertService } from '@/lib/firebase/alerts';

// Helper function to get location with a Promise-based approach
const getLocation = (): Promise<{latitude: number, longitude: number} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Could not get location: ', error.message);
        resolve(null); // Resolve with null if there's an error or permission is denied
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};


export function useStatusUpdater() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStatusUpdate = async (status: 'safe' | 'help') => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to update your status.',
      });
      return;
    }

    try {
      const locationCoords = await getLocation();
      const locationGeoPoint = locationCoords ? new GeoPoint(locationCoords.latitude, locationCoords.longitude) : null;
      
      // If status is 'help', create a critical alert in the 'alerts' collection
      if (status === 'help') {
        const locationString = locationCoords
          ? `at location: ${locationCoords.latitude.toFixed(4)}, ${locationCoords.longitude.toFixed(4)}`
          : 'at an unknown location';

        await AlertService.createAlert({
          title: `SOS: Help request from ${user.displayName || 'a user'}`,
          description: `A user has requested immediate assistance ${locationString}.`,
          severity: 'Critical',
          type: 'Other',
          affectedAreas: locationCoords ? [`Lat: ${locationCoords.latitude.toFixed(4)}, Lon: ${locationCoords.longitude.toFixed(4)}`] : ['Location not available'],
          createdBy: user.uid,
          location: locationGeoPoint || undefined,
          acknowledged: false,
          rescueStatus: null,
        });
      }

      // Always update the user's general status in the 'user_status' collection for the live map
      await updateUserStatus({
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatarUrl: user.photoURL || undefined,
        status,
        location: locationGeoPoint,
        timestamp: serverTimestamp(),
      });

      toast({
        title: 'Status Updated',
        description: `You've been marked as ${status}. Your location has ${locationCoords ? '' : 'not '}been shared.`,
      });

    } catch (error) {
      console.error("Error during status update:", error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your status. Please try again.',
      });
      // Re-throw the error if you want the calling component to handle it
      throw error;
    }
  };

  return { handleStatusUpdate };
}
