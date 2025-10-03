
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/firebase/error-emitter';
import type { FirestorePermissionError } from '@/lib/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a real app, you might send this to a logging service.
      // For development, we'll throw it to get the Next.js overlay.
      if (process.env.NODE_ENV === 'development') {
        // Throwing the error will make it appear in the Next.js error overlay
        // which is great for debugging security rules.
        throw error;
      } else {
        // In production, just show a generic toast.
        console.error('Firestore Permission Error:', error.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
