
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  dateOfBirth: string; // ISO string format: "YYYY-MM-DD"
}

// Add other shared types here as needed, for example:
// export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';
// However, UserRole is already defined in AppContext.tsx
