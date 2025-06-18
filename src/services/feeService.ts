
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  // addDoc, // Example for admin
  // serverTimestamp, // Example for admin
} from 'firebase/firestore';
import type { FeeRecord, FeeStatus } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

const feesCollectionRef = collection(db, 'feeRecords');

const fromFirestoreToFeeRecord = (docSnap: QueryDocumentSnapshot<DocumentData>): FeeRecord => {
  const data = docSnap.data();
  
  let issuedDateStr = '';
  if (data.issuedDate) {
    const iDate = data.issuedDate instanceof Timestamp ? data.issuedDate.toDate() : (typeof data.issuedDate === 'string' ? parseISO(data.issuedDate) : new Date(data.issuedDate));
    if (isValid(iDate)) {
      issuedDateStr = format(iDate, 'yyyy-MM-dd');
    } else {
      console.warn(`Invalid issuedDate for fee record ${docSnap.id}`);
      issuedDateStr = 'N/A';
    }
  }

  let dueDateStr = '';
  if (data.dueDate) {
    const dDate = data.dueDate instanceof Timestamp ? data.dueDate.toDate() : (typeof data.dueDate === 'string' ? parseISO(data.dueDate) : new Date(data.dueDate));
     if (isValid(dDate)) {
      dueDateStr = format(dDate, 'yyyy-MM-dd');
    } else {
      console.warn(`Invalid dueDate for fee record ${docSnap.id}`);
      dueDateStr = 'N/A';
    }
  }

  return {
    id: docSnap.id,
    studentId: data.studentId,
    description: data.description,
    amountDue: data.amountDue || 0,
    amountPaid: data.amountPaid || 0,
    issuedDate: issuedDateStr,
    dueDate: dueDateStr,
    status: data.status as FeeStatus || 'pending',
  };
};

export const getFeesForStudent = async (studentId: string): Promise<FeeRecord[]> => {
  try {
    const q = query(
      feesCollectionRef,
      where('studentId', '==', studentId),
      orderBy('issuedDate', 'desc') // Show most recently issued fees first
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestoreToFeeRecord);
  } catch (error) {
    console.error(`Error fetching fee records for student ${studentId}: `, error);
    throw new Error(`Failed to fetch fee records for student ${studentId}.`);
  }
};

/* Example function for admin to add fee records (not used by parent page)
export const addFeeRecordToFirestore = async (feeData: Omit<FeeRecord, 'id'>): Promise<FeeRecord> => {
  try {
    const dataToSave = {
      ...feeData,
      issuedDate: Timestamp.fromDate(parseISO(feeData.issuedDate)),
      dueDate: Timestamp.fromDate(parseISO(feeData.dueDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(feesCollectionRef, dataToSave);
    // To return the full FeeRecord, we'd ideally fetch or merge server timestamps.
    // For simplicity, returning the input with new ID.
    return { 
      ...feeData, 
      id: docRef.id,
      // Dates would be stringified again if fetched through fromFirestoreToFeeRecord
      issuedDate: feeData.issuedDate, 
      dueDate: feeData.dueDate 
    };
  } catch (error) {
    console.error("Error adding fee record: ", error);
    throw new Error("Failed to add fee record.");
  }
};
*/
