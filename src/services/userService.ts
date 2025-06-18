
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserRole } from '@/contexts/AppContext';

interface UserDocumentData {
  email: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as UserDocumentData;
      return userData.role;
    } else {
      // No user document found, so no role stored yet
      return null;
    }
  } catch (error) {
    console.error("Error fetching user role from Firestore: ", error);
    // Depending on policy, could throw error or return null
    // Returning null allows app to proceed to role selection for new users
    return null;
  }
};

export const setUserRole = async (uid: string, email: string | null, role: UserRole): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userData: Partial<UserDocumentData> = {
      email: email,
      role: role,
      updatedAt: serverTimestamp() as Timestamp,
    };

    // Check if document exists to set createdAt only on creation
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      userData.createdAt = serverTimestamp() as Timestamp;
    }

    await setDoc(userDocRef, userData, { merge: true }); // merge: true to avoid overwriting other fields if any
  } catch (error) {
    console.error("Error setting user role in Firestore: ", error);
    throw new Error("Failed to save user role.");
  }
};
