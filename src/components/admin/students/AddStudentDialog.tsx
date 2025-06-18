
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentForm, type StudentFormData } from './StudentForm';
import type { Student } from '@/types';
import { format } from 'date-fns';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { addStudentToFirestore } from '@/services/studentService';
import { setUserRole } from '@/services/userService';


interface AddStudentDialogProps {
  onStudentAdded: () => void; // Callback to refresh student list, no need for data
  children: React.ReactNode;
}

export function AddStudentDialog({ onStudentAdded, children }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error("Failed to create Firebase user.");
      }
      const uid = firebaseUser.uid;

      // 2. Prepare student profile data for Firestore
      const studentProfileData: Omit<Student, 'id'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email, // Email is part of profile too
        grade: data.grade,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      };

      // 3. Add student profile to 'students' collection using UID as document ID
      await addStudentToFirestore(uid, studentProfileData);

      // 4. Set user role in 'users' collection
      await setUserRole(uid, data.email, 'student');
      
      toast({
        title: "Student Added Successfully",
        description: `${data.firstName} ${data.lastName} has been added and their account created.`,
      });
      onStudentAdded(); // Refresh the list on the parent page
      setIsOpen(false);

    } catch (error: any) {
      console.error("Error adding student:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use by another account.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please use a stronger password.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        variant: "destructive",
        title: "Failed to Add Student",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) setIsOpen(open); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student and create their login credentials.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
            isEditMode={false} // Explicitly set to false for Add dialog
        />
      </DialogContent>
    </Dialog>
  );
}
