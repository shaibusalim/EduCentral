
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  dateOfBirth: string; // ISO string format: "YYYY-MM-DD"
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string; // e.g., "Mathematics", "Physics"
  dateOfJoining: string; // ISO string format: "YYYY-MM-DD"
}

export interface ClassItem {
  id: string;
  name: string; // e.g., "Grade 10 Section A", "Standard 5"
  assignedTeacherName: string; // For simplicity, just the name. Could be teacherId later.
  roomNumber?: string; // Optional
}

export interface SubjectItem {
  id: string;
  name: string; // e.g., "Mathematics", "Physics"
  // Potentially add subjectCode or teacherId in the future
}

export type NotificationType = 'announcement' | 'alert' | 'info';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  date: string; // ISO string format
  read: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked';

export interface AttendanceRecord {
  id?: string; // Firestore document ID, optional as it's not present before saving
  studentId: string;
  studentName: string; // Denormalized for easier display, though could be fetched
  classId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  className?: string; // Denormalized for easier display if needed
}

export interface GradeRecord {
  id?: string; // Firestore document ID
  studentId: string;
  classId: string;
  assessmentName: string; // e.g., "Mid-Term Exam", "Homework 1", "Final Grade"
  grade: string; // e.g., "A+", "85%", "Pass"
  remarks: string; // Optional comments from the teacher
  // studentName and className could be denormalized here if frequently needed for display without extra lookups
}

export type FeeStatus = 'pending' | 'paid' | 'overdue' | 'partially_paid';

export interface FeeRecord {
  id: string; // Firestore document ID
  studentId: string;
  description: string; // e.g., "Term 1 Fees - 2024", "Library Fine"
  amountDue: number;
  amountPaid: number; // Total amount paid towards this specific fee item
  issuedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: FeeStatus;
  // Timestamps for creation/update will be handled by Firestore serverTimestamp by an admin process
}

// Add other shared types here as needed
