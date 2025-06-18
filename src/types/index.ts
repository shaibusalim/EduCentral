
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

// Add other shared types here as needed
