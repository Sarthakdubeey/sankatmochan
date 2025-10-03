
import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import type { UserStatus } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

const userStatusCollection = collection(db, 'user_status');

export const updateUserStatus = async (statusData: Omit<UserStatus, 'id'>) => {
    const statusDocRef = doc(userStatusCollection, statusData.userId);
    try {
        await setDoc(statusDocRef, statusData, { merge: true });
        return statusData.userId;
    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: statusDocRef.path,
            operation: 'update',
            requestResourceData: statusData,
          });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    }
}
