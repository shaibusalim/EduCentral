
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
import type { GradeRecord } from '@/types';

const gradesCollectionRef = collection(db, 'gradeRecords');

const fromFirestore = (docSnap: QueryDocumentSnapshot<DocumentData>): GradeRecord => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    studentId: data.studentId,
    classId: data.classId,
    assessmentName: data.assessmentName,
    grade: data.grade,
    remarks: data.remarks || '',
  };
};

export const getGradesForClassAssessment = async (
  classId: string,
  assessmentName: string
): Promise<GradeRecord[]> => {
  try {
    const q = query(
      gradesCollectionRef,
      where('classId', '==', classId),
      where('assessmentName', '==', assessmentName)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error('Error fetching grade records: ', error);
    throw new Error('Failed to fetch grade records.');
  }
};

export const getGradesForStudent = async (studentId: string): Promise<GradeRecord[]> => {
  try {
    const q = query(
      gradesCollectionRef,
      where('studentId', '==', studentId),
      orderBy('assessmentName', 'asc') // Optional: order by assessment name
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error(`Error fetching grades for student ${studentId}: `, error);
    throw new Error(`Failed to fetch grades for student ${studentId}.`);
  }
};

export const saveOrUpdateStudentGrades = async (
  classId: string,
  assessmentName: string,
  studentGradesData: Array<{ studentId: string; studentName: string; grade: string; remarks: string }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    const existingRecordsQuery = query(
      gradesCollectionRef,
      where('classId', '==', classId),
      where('assessmentName', '==', assessmentName)
    );
    const querySnapshot = await getDocs(existingRecordsQuery);
    const existingRecordsMap = new Map<string, { id: string, data: GradeRecord }>();
    querySnapshot.forEach(docSnap => {
      const record = fromFirestore(docSnap);
      existingRecordsMap.set(record.studentId, { id: docSnap.id, data: record });
    });

    for (const studentGrade of studentGradesData) {
      if (!studentGrade.grade.trim()) continue; // Don't save if grade is empty

      const gradeDataPayload = {
        studentId: studentGrade.studentId,
        // studentName: studentGrade.studentName, // Denormalize if needed, but studentId is key
        classId: classId,
        assessmentName: assessmentName,
        grade: studentGrade.grade,
        remarks: studentGrade.remarks,
        updatedAt: serverTimestamp() as Timestamp,
      };

      if (existingRecordMap.has(studentGrade.studentId)) {
        const existingRecord = existingRecordsMap.get(studentGrade.studentId)!;
        // Update existing record
        const recordRef = doc(db, 'gradeRecords', existingRecord.id);
        batch.update(recordRef, gradeDataPayload);
      } else {
        // Create new record
        const newRecordRef = doc(collection(db, 'gradeRecords'));
        batch.set(newRecordRef, {
          ...gradeDataPayload,
          createdAt: serverTimestamp() as Timestamp,
        });
      }
    }
    await batch.commit();
  } catch (error) {
    console.error('Error saving/updating grades: ', error);
    throw new Error('Failed to save or update grade records.');
  }
};

