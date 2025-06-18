
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
import type { Student } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

const studentsCollectionRef = collection(db, 'students');

// This interface reflects the data structure within the 'students' collection
interface StudentProfileDocumentData {
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  dateOfBirth: Timestamp; // Stored as Timestamp in Firestore
  createdAt: Timestamp; // Firestore server timestamp
  updatedAt: Timestamp; // Firestore server timestamp
}


const fromFirestore = (docSnap: any): Student => {
  const data = docSnap.data(); // Student profile specific data
  let formattedDateOfBirth = '';
  if (data.dateOfBirth && data.dateOfBirth.toDate) {
    const dateObj = data.dateOfBirth.toDate();
    if (isValid(dateObj)) {
      formattedDateOfBirth = format(dateObj, 'yyyy-MM-dd');
    } else {
      console.warn(`Invalid dateOfBirth received from Firestore for student ${docSnap.id}:`, data.dateOfBirth);
    }
  } else {
     console.warn(`Missing or invalid dateOfBirth for student ${docSnap.id}`);
  }

  return {
    id: docSnap.id, // This ID will be the Firebase UID
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    grade: data.grade,
    dateOfBirth: formattedDateOfBirth,
  };
};

export const getStudents = async (): Promise<Student[]> => {
  try {
    const q = query(studentsCollectionRef, orderBy("lastName", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching students: ", error);
    throw new Error("Failed to fetch students.");
  }
};

// Modified to accept UID and use setDoc
export const addStudentToFirestore = async (uid: string, studentProfileData: Omit<Student, 'id'>): Promise<void> => {
  try {
    const studentDocRef = doc(db, 'students', uid); // Use UID as document ID
    const dataToSave: Omit<StudentProfileDocumentData, 'updatedAt'> = {
      firstName: studentProfileData.firstName,
      lastName: studentProfileData.lastName,
      email: studentProfileData.email,
      grade: studentProfileData.grade,
      dateOfBirth: Timestamp.fromDate(parseISO(studentProfileData.dateOfBirth)),
      createdAt: serverTimestamp() as Timestamp,
      // updatedAt will be set by Firestore on creation too
    };
    await setDoc(studentDocRef, { ...dataToSave, updatedAt: serverTimestamp() as Timestamp });
  } catch (error) {
    console.error("Error adding student profile to Firestore: ", error);
    throw new Error("Failed to add student profile.");
  }
};

// updateStudentInFirestore remains largely the same for editing profile data,
// but it will operate on a document identified by UID.
// Email and password changes would be handled separately via Firebase Auth methods.
export const updateStudentInFirestore = async (studentId: string, studentData: Omit<Student, 'id' | 'email'>): Promise<void> => {
  try {
    const studentDocRef = doc(db, 'students', studentId); // studentId is the UID
    const dataToUpdate: Partial<Omit<StudentProfileDocumentData, 'email' | 'createdAt'>> = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      grade: studentData.grade,
      dateOfBirth: Timestamp.fromDate(parseISO(studentData.dateOfBirth)),
      updatedAt: serverTimestamp() as Timestamp,
    };
    await updateDoc(studentDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating student profile: ", error);
    throw new Error("Failed to update student profile.");
  }
};

// deleteStudentFromFirestore will delete the student's profile.
// Deleting the Firebase Auth user would be a separate step, often handled by an admin or a Cloud Function.
export const deleteStudentFromFirestore = async (studentId: string): Promise<void> => {
  try {
    const studentDocRef = doc(db, 'students', studentId); // studentId is the UID
    await deleteDoc(studentDocRef);
    // Note: Also need to delete from 'users' collection and Firebase Auth
  } catch (error) {
    console.error("Error deleting student profile: ", error);
    throw new Error("Failed to delete student profile.");
  }
};
