
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc, // Changed from addDoc
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import type { Teacher } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

const teachersCollectionRef = collection(db, 'teachers');

interface TeacherDocumentData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  dateOfJoining: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const fromFirestore = (docSnap: any): Teacher => {
  const data = docSnap.data();
  let formattedDateOfJoining = '';
  if (data.dateOfJoining && data.dateOfJoining.toDate) {
    const dateObj = data.dateOfJoining.toDate();
    if (isValid(dateObj)) {
      formattedDateOfJoining = format(dateObj, 'yyyy-MM-dd');
    } else {
      console.warn(`Invalid dateOfJoining received from Firestore for teacher ${docSnap.id}:`, data.dateOfJoining);
    }
  } else {
     console.warn(`Missing or invalid dateOfJoining for teacher ${docSnap.id}`);
  }

  return {
    id: docSnap.id, // This will be the Firebase UID
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    subject: data.subject,
    dateOfJoining: formattedDateOfJoining,
  };
};

export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const q = query(teachersCollectionRef, orderBy("lastName", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching teachers: ", error);
    throw new Error("Failed to fetch teachers.");
  }
};

export const addTeacherToFirestore = async (uid: string, teacherProfileData: Omit<Teacher, 'id'>): Promise<void> => {
  try {
    const teacherDocRef = doc(db, 'teachers', uid);
    const dataToSave = {
      firstName: teacherProfileData.firstName,
      lastName: teacherProfileData.lastName,
      email: teacherProfileData.email,
      subject: teacherProfileData.subject,
      dateOfJoining: Timestamp.fromDate(parseISO(teacherProfileData.dateOfJoining)),
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    await setDoc(teacherDocRef, dataToSave);
  } catch (error) {
    console.error("Error adding teacher profile to Firestore: ", error);
    throw new Error("Failed to add teacher profile.");
  }
};

// Password and email changes are handled via Firebase Auth, not this profile update
export const updateTeacherInFirestore = async (teacherId: string, teacherData: Omit<Teacher, 'id' | 'email'>): Promise<void> => {
  try {
    const teacherDocRef = doc(db, 'teachers', teacherId); // teacherId is UID
    const dataToUpdate: Partial<Omit<TeacherDocumentData, 'email' | 'createdAt'>> = {
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      subject: teacherData.subject,
      dateOfJoining: Timestamp.fromDate(parseISO(teacherData.dateOfJoining)),
      updatedAt: serverTimestamp() as Timestamp,
    };
    await updateDoc(teacherDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating teacher profile: ", error);
    throw new Error("Failed to update teacher profile.");
  }
};

export const deleteTeacherFromFirestore = async (teacherId: string): Promise<void> => {
  try {
    const teacherDocRef = doc(db, 'teachers', teacherId);
    await deleteDoc(teacherDocRef);
    // Note: Also need to delete from 'users' collection and Firebase Auth
  } catch (error) {
    console.error("Error deleting teacher profile: ", error);
    throw new Error("Failed to delete teacher profile.");
  }
};
