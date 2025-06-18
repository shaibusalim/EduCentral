
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
import type { ClassItem } from '@/types';

const classesCollectionRef = collection(db, 'classes');

interface ClassDocumentData {
  name: string;
  assignedTeacherName: string;
  roomNumber?: string;
  createdAt?: Timestamp;
}

const fromFirestore = (docSnap: any): ClassItem => {
  const data = docSnap.data() as ClassDocumentData;
  return {
    id: docSnap.id,
    name: data.name,
    assignedTeacherName: data.assignedTeacherName,
    roomNumber: data.roomNumber || '', // Ensure roomNumber is a string, even if undefined
  };
};

export const getClasses = async (): Promise<ClassItem[]> => {
  try {
    const q = query(classesCollectionRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching classes: ", error);
    throw new Error("Failed to fetch classes.");
  }
};

export const addClassToFirestore = async (classData: Omit<ClassItem, 'id'>): Promise<ClassItem> => {
  try {
    const dataToSave: ClassDocumentData & { createdAt: Timestamp } = {
      name: classData.name,
      assignedTeacherName: classData.assignedTeacherName,
      roomNumber: classData.roomNumber,
      createdAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(classesCollectionRef, dataToSave);
    return {
      ...classData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding class: ", error);
    throw new Error("Failed to add class.");
  }
};

export const updateClassInFirestore = async (classId: string, classData: Omit<ClassItem, 'id'>): Promise<void> => {
  try {
    const classDocRef = doc(db, 'classes', classId);
    // Ensure all fields intended for update are present
    const dataToUpdate: Partial<ClassDocumentData> = {
        name: classData.name,
        assignedTeacherName: classData.assignedTeacherName,
        roomNumber: classData.roomNumber,
    };
    await updateDoc(classDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating class: ", error);
    throw new Error("Failed to update class.");
  }
};

export const deleteClassFromFirestore = async (classId: string): Promise<void> => {
  try {
    const classDocRef = doc(db, 'classes', classId);
    await deleteDoc(classDocRef);
  } catch (error) {
    console.error("Error deleting class: ", error);
    throw new Error("Failed to delete class.");
  }
};
