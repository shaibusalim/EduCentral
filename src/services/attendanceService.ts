
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
import { getClasses } from './classService'; // Import getClasses

// This helper is used by getAttendanceForClass and returns a more minimal record
const fromFirestoreToMinimalAttendanceRecord = (docSnap: QueryDocumentSnapshot<DocumentData>): Omit<AttendanceRecord, 'studentName' | 'className'> & { id: string } => {
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
    return querySnapshot.docs.map(fromFirestoreToMinimalAttendanceRecord);
  } catch (error) {
    console.error('Error fetching attendance records for class: ', error);
    throw new Error('Failed to fetch attendance records for class.');
  }
};

// Updated return type to include className
export const getAttendanceForStudent = async (studentId: string): Promise<Array<Omit<AttendanceRecord, 'studentName'> & { id: string }>> => {
  try {
    const [allClasses, attendanceSnapshot] = await Promise.all([
      getClasses(),
      getDocs(query(
        collection(db, 'attendanceRecords'),
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      ))
    ]);

    const classMap = new Map(allClasses.map(c => [c.id, c.name]));

    return attendanceSnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        studentId: data.studentId,
        classId: data.classId,
        className: classMap.get(data.classId) || data.classId, // Fallback to classId if name not found
        date: data.date,
        status: data.status as AttendanceStatus,
      };
    });
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
      collection(db, 'attendanceRecords'),
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

      const payload = {
        studentId: attendance.studentId,
        // studentName: attendance.studentName, // Denormalized studentName for teacher view, not strictly part of core record
        classId: classId,
        date: date,
        status: attendance.status,
        updatedAt: serverTimestamp() as Timestamp,
      };

      if (existingRecordsMap.has(attendance.studentId)) {
        const existingRecord = existingRecordsMap.get(attendance.studentId)!;
        if (existingRecord.data.status !== attendance.status) { // Only update if status changed
          const recordRef = doc(db, 'attendanceRecords', existingRecord.id);
          batch.update(recordRef, payload);
        }
      } else {
        const newRecordRef = doc(collection(db, 'attendanceRecords'));
        batch.set(newRecordRef, {
          ...payload,
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
