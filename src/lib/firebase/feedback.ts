
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Feedback } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// Service class for handling Firestore operations for feedback
export class FeedbackService {
  private static feedbackCollection = collection(db, 'feedback');

  // Submit new feedback to Firestore
  static async submitFeedback(feedbackData: Omit<Feedback, 'id' | 'timestamp'>): Promise<string | undefined> {
    const data = {
      ...feedbackData,
      timestamp: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(this.feedbackCollection, data);
      return docRef.id;
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: this.feedbackCollection.path,
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    }
  }
}
