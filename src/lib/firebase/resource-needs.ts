
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import type { ResourceNeed } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// Service class for handling Firestore operations for resource needs
export class ResourceNeedService {
  private static needsCollection = collection(db, 'resource_needs');

  // Create a new resource need in Firestore
  static async createResourceNeed(needData: Omit<ResourceNeed, 'id'>): Promise<string | undefined> {
    try {
      const docRef = await addDoc(this.needsCollection, needData);
      return docRef.id;
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: this.needsCollection.path,
        operation: 'create',
        requestResourceData: needData,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    }
  }

  // Fetch all unfulfilled resource needs from Firestore
  static async getResourceNeeds(): Promise<ResourceNeed[]> {
    try {
      const q = query(this.needsCollection, where('fulfilled', '==', false));
      const querySnapshot = await getDocs(q);
      const needs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ResourceNeed));
      return needs;
    } catch (error) {
      console.error("Error fetching resource needs: ", error);
      throw new Error("Failed to fetch resource needs.");
    }
  }

  // Mark a resource need as fulfilled
  static async fulfillResourceNeed(needId: string): Promise<void> {
    const needDocRef = doc(db, 'resource_needs', needId);
    const updateData = { fulfilled: true };
    try {
        await updateDoc(needDocRef, updateData);
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: needDocRef.path,
            operation: 'update',
            requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    }
  }
}
