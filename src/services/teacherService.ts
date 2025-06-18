
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
import type { Teacher } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

const teachersCollectionRef = collection(db, 'teachers');

interface TeacherDocumentData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  dateOfJoining: Timestamp;
  createdAt?: Timestamp;
}

const fromFirestore = (docSnap: any): Teacher => {
  const data = docSnap.data() as TeacherDocumentData;
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
    id: docSnap.id,
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

export const addTeacherToFirestore = async (teacherData: Omit<Teacher, 'id'>): Promise<Teacher> => {
  try {
    const dataToSave: Omit<TeacherDocumentData, 'dateOfJoining' | 'createdAt'> & { dateOfJoining: Timestamp, createdAt: Timestamp } = {
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      email: teacherData.email,
      subject: teacherData.subject,
      dateOfJoining: Timestamp.fromDate(parseISO(teacherData.dateOfJoining)),
      createdAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(teachersCollectionRef, dataToSave);
    return {
      ...teacherData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding teacher: ", error);
    throw new Error("Failed to add teacher.");
  }
};

export const updateTeacherInFirestore = async (teacherId: string, teacherData: Omit<Teacher, 'id'>): Promise<void> => {
  try {
    const teacherDocRef = doc(db, 'teachers', teacherId);
    const dataToUpdate = {
      ...teacherData,
      dateOfJoining: Timestamp.fromDate(parseISO(teacherData.dateOfJoining)),
    };
    await updateDoc(teacherDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating teacher: ", error);
    throw new Error("Failed to update teacher.");
  }
};

export const deleteTeacherFromFirestore = async (teacherId: string): Promise<void> => {
  try {
    const teacherDocRef = doc(db, 'teachers', teacherId);
    await deleteDoc(teacherDocRef);
  } catch (error) {
    console.error("Error deleting teacher: ", error);
    throw new Error("Failed to delete teacher.");
  }
};
