
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
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

interface StudentDocumentData {
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  dateOfBirth: Timestamp;
  createdAt?: Timestamp;
}

const fromFirestore = (docSnap: any): Student => {
  const data = docSnap.data() as StudentDocumentData;
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
    id: docSnap.id,
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

export const addStudentToFirestore = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
  try {
    const dataToSave: Omit<StudentDocumentData, 'dateOfBirth' | 'createdAt'> & { dateOfBirth: Timestamp, createdAt: Timestamp } = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      grade: studentData.grade,
      dateOfBirth: Timestamp.fromDate(parseISO(studentData.dateOfBirth)),
      createdAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(studentsCollectionRef, dataToSave);
    return {
      ...studentData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding student: ", error);
    throw new Error("Failed to add student.");
  }
};

export const updateStudentInFirestore = async (studentId: string, studentData: Omit<Student, 'id'>): Promise<void> => {
  try {
    const studentDocRef = doc(db, 'students', studentId);
    const dataToUpdate = {
      ...studentData,
      dateOfBirth: Timestamp.fromDate(parseISO(studentData.dateOfBirth)),
    };
    await updateDoc(studentDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating student: ", error);
    throw new Error("Failed to update student.");
  }
};

export const deleteStudentFromFirestore = async (studentId: string): Promise<void> => {
  try {
    const studentDocRef = doc(db, 'students', studentId);
    await deleteDoc(studentDocRef);
  } catch (error) {
    console.error("Error deleting student: ", error);
    throw new Error("Failed to delete student.");
  }
};
