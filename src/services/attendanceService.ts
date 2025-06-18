
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
} from 'firebase/firestore';
import type { AttendanceRecord, AttendanceStatus } from '@/types';

const attendanceCollectionRef = collection(db, 'attendanceRecords');

const fromFirestore = (docSnap: QueryDocumentSnapshot<DocumentData>): Omit<AttendanceRecord, 'studentName' | 'className'> & { id: string } => {
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
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error('Error fetching attendance records: ', error);
    throw new Error('Failed to fetch attendance records.');
  }
};

export const saveOrUpdateStudentAttendance = async (
  classId: string,
  date: string, // YYYY-MM-DD
  studentAttendances: Array<{ studentId: string; studentName: string; status: AttendanceStatus }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    // Fetch existing records for this class and date to determine updates vs. new entries
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
      if (attendance.status === 'unmarked') continue; // Don't save 'unmarked' status

      const existingRecord = existingRecordsMap.get(attendance.studentId);

      if (existingRecord) {
        // Update existing record if status changed
        if (existingRecord.data.status !== attendance.status) {
          const recordRef = doc(db, 'attendanceRecords', existingRecord.id);
          batch.update(recordRef, {
            status: attendance.status,
            updatedAt: serverTimestamp() as Timestamp,
          });
        }
      } else {
        // Create new record
        const newRecordRef = doc(collection(db, 'attendanceRecords'));
        batch.set(newRecordRef, {
          studentId: attendance.studentId,
          classId: classId,
          date: date,
          status: attendance.status,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        });
      }
    }
    await batch.commit();
  } catch (error) {
    console.error('Error saving/updating attendance: ', error);
    throw new Error('Failed to save or update attendance records.');
  }
};
