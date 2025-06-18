
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
import type { SubjectItem } from '@/types';

const subjectsCollectionRef = collection(db, 'subjects');

interface SubjectDocumentData {
  name: string;
  createdAt?: Timestamp;
}

const fromFirestore = (docSnap: any): SubjectItem => {
  const data = docSnap.data() as SubjectDocumentData;
  return {
    id: docSnap.id,
    name: data.name,
  };
};

export const getSubjects = async (): Promise<SubjectItem[]> => {
  try {
    const q = query(subjectsCollectionRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching subjects: ", error);
    throw new Error("Failed to fetch subjects.");
  }
};

export const addSubjectToFirestore = async (subjectData: Omit<SubjectItem, 'id'>): Promise<SubjectItem> => {
  try {
    const dataToSave: SubjectDocumentData & { createdAt: Timestamp } = {
      name: subjectData.name,
      createdAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(subjectsCollectionRef, dataToSave);
    return {
      id: docRef.id,
      name: subjectData.name,
    };
  } catch (error) {
    console.error("Error adding subject: ", error);
    throw new Error("Failed to add subject.");
  }
};

export const updateSubjectInFirestore = async (subjectId: string, subjectData: Omit<SubjectItem, 'id'>): Promise<void> => {
  try {
    const subjectDocRef = doc(db, 'subjects', subjectId);
    const dataToUpdate: Partial<SubjectDocumentData> = {
        name: subjectData.name,
    };
    await updateDoc(subjectDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating subject: ", error);
    throw new Error("Failed to update subject.");
  }
};

export const deleteSubjectFromFirestore = async (subjectId: string): Promise<void> => {
  try {
    const subjectDocRef = doc(db, 'subjects', subjectId);
    await deleteDoc(subjectDocRef);
  } catch (error)
    {
    console.error("Error deleting subject: ", error);
    throw new Error("Failed to delete subject.");
  }
};
