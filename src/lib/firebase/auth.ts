
// src/lib/firebase/auth.ts
import { 
  getAuth, 
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import app, { db } from './firebase';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';


export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const createUserProfileDocument = async (user: User, additionalData: { displayName?: string } = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { uid, email, photoURL, phoneNumber } = user;
    const createdAt = new Date();
    
    // Use displayName from additionalData if available (for email/pass signup)
    const displayName = additionalData.displayName || user.displayName;

    try {
        // If a display name was provided, update the user's auth profile first
        if (displayName && !user.displayName) {
            await updateProfile(user, { displayName });
        }
        
        // Now create the document in firestore
        const userProfile: UserProfile = {
            uid,
            email,
            displayName,
            photoURL,
            phoneNumber,
            createdAt,
        };
        
        try {
            await setDoc(userRef, userProfile);
        } catch (error: any) {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'create',
                requestResourceData: userProfile,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw error;
        }

    } catch (error) {
      console.error("Error creating user profile", error);
    }
  }
  return userRef;
};


export const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
};

export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
            await createUserProfileDocument(result.user);
            return result.user;
        }
    } catch (error) {
        console.error("Error during sign-in redirect:", error);
    }
    return null;
}

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfileDocument(user, { displayName });
};

export const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
  }
};
