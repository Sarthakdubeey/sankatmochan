
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Alert } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// Service class for handling Firestore operations for alerts
export class AlertService {
  private static alertsCollection = collection(db, 'alerts');

  // Create a new alert in Firestore
  static async createAlert(alertData: Omit<Alert, 'id' | 'timestamp'>): Promise<string | undefined> {
    const data = {
      ...alertData,
      timestamp: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(this.alertsCollection, data);
      return docRef.id;
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: this.alertsCollection.path,
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    }
  }
  
  // Update an existing alert
  static async updateAlert(alertId: string, dataToUpdate: Partial<Alert>): Promise<void> {
    const alertDocRef = doc(db, 'alerts', alertId);
    try {
        await updateDoc(alertDocRef, dataToUpdate);
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: alertDocRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    }
  }

  // Fetch all alerts from Firestore, ordered by timestamp
  static async getAlerts(): Promise<Alert[]> {
    try {
      const q = query(this.alertsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const alerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Alert));
      return alerts;
    } catch (error) {
      console.error("Error fetching alerts: ", error);
      throw new Error("Failed to fetch alerts.");
    }
  }

  // Delete an alert from Firestore
  static async deleteAlert(alertId: string): Promise<void> {
    const alertDocRef = doc(db, 'alerts', alertId);
    try {
      await deleteDoc(alertDocRef);
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: alertDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    }
  }

  // Acknowledge an SOS alert and dispatch a team
  static async acknowledgeSosAlert(alertId: string): Promise<void> {
    const alertDocRef = doc(db, 'alerts', alertId);
    const updateData = {
        acknowledged: true,
        rescueStatus: 'Dispatched',
        rescueTeam: 'Bravo Team',
        eta: 'approx. 30 minutes',
      };
    try {
      await updateDoc(alertDocRef, updateData);
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: alertDocRef.path,
            operation: 'update',
            requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    }
  }
}
