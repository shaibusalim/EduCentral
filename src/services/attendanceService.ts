
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  orderBy,
} from 'firebase/firestore';
import type { AttendanceRecord, AttendanceStatus } from '@/types';

const attendanceCollectionRef = collection(db, 'attendanceRecords');

// Adjusted to return fields relevant for various contexts
const fromFirestoreToAttendanceRecord = (docSnap: QueryDocumentSnapshot<DocumentData>): Omit<AttendanceRecord, 'studentName' | 'className'> & { id: string } => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    studentId: data.studentId,
    classId: data.classId,
    date: data.date, // Assuming date is stored as YYYY-MM-DD string
    status: data.status as AttendanceStatus,
  };
};

export const getAttendanceForClass = async (classId: string, date: string): Promise<Array<Omit<AttendanceRecord, 'studentName' | 'className'> & { id: string }>> => {
  try {
    const q = query(
      attendanceCollectionRef,
      where('classId', '==', classId),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestoreToAttendanceRecord);
  } catch (error) {
    console.error('Error fetching attendance records for class: ', error);
    throw new Error('Failed to fetch attendance records for class.');
  }
};

export const getAttendanceForStudent = async (studentId: string): Promise<Array<Omit<AttendanceRecord, 'studentName' | 'className'> & { id: string }>> => {
  try {
    const q = query(
      attendanceCollectionRef,
      where('studentId', '==', studentId),
      orderBy('date', 'desc') // Show most recent first
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestoreToAttendanceRecord);
  } catch (error) {
    console.error(`Error fetching attendance records for student ${studentId}: `, error);
    throw new Error(`Failed to fetch attendance records for student ${studentId}.`);
  }
};

export const saveOrUpdateStudentAttendance = async (
  classId: string,
  date: string, // YYYY-MM-DD
  studentAttendances: Array<{ studentId: string; studentName: string; status: AttendanceStatus }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    const existingRecordsQuery = query(
      attendanceCollectionRef,
      where('classId', '==', classId),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(existingRecordsQuery);
    const existingRecordsMap = new Map<string, { id: string, data: DocumentData }>();
    querySnapshot.forEach(docSnap => {
      existingRecordsMap.set(docSnap.data().studentId, { id: docSnap.id, data: docSnap.data() });
    });

    for (const attendance of studentAttendances) {
      if (attendance.status === 'unmarked') continue; 

      const existingRecord = existingRecordsMap.get(attendance.studentId);

      const payload = {
        studentId: attendance.studentId,
        classId: classId,
        date: date,
        status: attendance.status,
        updatedAt: serverTimestamp() as Timestamp,
      };

      if (existingRecord) {
        if (existingRecord.data.status !== attendance.status) {
          const recordRef = doc(db, 'attendanceRecords', existingRecord.id);
          batch.update(recordRef, payload);
        }
      } else {
        const newRecordRef = doc(collection(db, 'attendanceRecords'));
        batch.set(newRecordRef, {
          ...payload,
          // studentName: attendance.studentName, // Denormalize if needed, but not part of fromFirestoreToAttendanceRecord
          createdAt: serverTimestamp() as Timestamp,
        });
      }
    }
    await batch.commit();
  } catch (error) {
    console.error('Error saving/updating attendance: ', error);
    throw new Error('Failed to save or update attendance records.');
  }
};
