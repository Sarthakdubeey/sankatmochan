
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { Alert } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

export function NotificationBar() {
  const { user } = useAuth();
  const [notification, setNotification] = useState<Alert | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch the most recent alerts and filter client-side to avoid index requirement.
    const alertsQuery = query(
        collection(db, 'alerts'),
        orderBy('timestamp', 'desc'),
        limit(5) // Fetch a few recent alerts to find a relevant one
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
        if (!snapshot.empty) {
            const latestAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Alert }));
            // Find the most recent, non-dismissed, high-priority alert
            const highPriorityAlert = latestAlerts.find(a => 
                (a.severity === 'Critical' || a.severity === 'High') && a.id !== dismissedId
            );

            if (highPriorityAlert) {
                setNotification(highPriorityAlert);
                setIsVisible(true);
            } else {
                // If no relevant alerts are found, ensure the bar is hidden
                setIsVisible(false);
                setNotification(null);
            }

        } else {
             setNotification(null);
             setIsVisible(false);
        }
    }, (error) => {
        console.error("Error fetching live notification:", error);
    });

    return () => unsubscribe();
  }, [user, dismissedId]);
  
  const handleDismiss = () => {
    if (notification) {
        setDismissedId(notification.id);
    }
    setIsVisible(false);
  }

  return (
     <AnimatePresence>
        {isVisible && notification && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-destructive text-destructive-foreground z-50 shadow-lg"
            >
                <div className="container mx-auto flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                        <div className="font-semibold">
                            <span className="mr-2 uppercase hidden sm:inline-block">{notification.severity} ALERT:</span>
                            <span className="text-sm sm:text-base">{notification.title}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDismiss}
                        className="hover:bg-destructive/50 h-8 w-8"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
