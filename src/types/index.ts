
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

// Add other shared types here as needed
