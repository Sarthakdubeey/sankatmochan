
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import type { DamageReport } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// Service class for handling Firestore operations for damage reports
export class DamageReportService {
  private static reportsCollection = collection(db, 'damage_reports');

  // Create a new damage report in Firestore
  static async createDamageReport(reportData: Omit<DamageReport, 'id' | 'timestamp'>): Promise<string | undefined> {
    const data = {
      ...reportData,
      timestamp: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(this.reportsCollection, data);
      return docRef.id;
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: this.reportsCollection.path,
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw error;
    }
  }

  // Fetch all damage reports from Firestore, ordered by timestamp
  static async getDamageReports(): Promise<DamageReport[]> {
    try {
      const q = query(this.reportsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as DamageReport));
      return reports;
    } catch (error) {
      console.error("Error fetching damage reports: ", error);
      throw new Error("Failed to fetch damage reports.");
    }
  }
}
