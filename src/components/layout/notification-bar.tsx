
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

  useEffect(() => {
    if (!user) return;

    const alertsQuery = query(
        collection(db, 'alerts'),
        where('severity', 'in', ['Critical', 'High']),
        orderBy('timestamp', 'desc'),
        limit(1)
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
        if (!snapshot.empty) {
            const latestAlert = snapshot.docs[0].data() as Alert;
            
            // Show notification only if it's new or different
            if (notification?.id !== latestAlert.id) {
                setNotification({ id: snapshot.docs[0].id, ...latestAlert });
                setIsVisible(true);
            }
        } else {
             setNotification(null);
             setIsVisible(false);
        }
    }, (error) => {
        console.error("Error fetching live notification:", error);
    });

    return () => unsubscribe();
  }, [user, notification?.id]);
  
  const handleDismiss = () => {
    setIsVisible(false);
  }

  if (!isVisible || !notification) {
    return null;
  }

  return (
     <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-destructive text-destructive-foreground z-50"
            >
                <div className="container mx-auto flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        <div className="font-semibold">
                            <span className="mr-2 uppercase">{notification.severity} ALERT:</span>
                            <span>{notification.title}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDismiss}
                        className="hover:bg-destructive/50"
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
