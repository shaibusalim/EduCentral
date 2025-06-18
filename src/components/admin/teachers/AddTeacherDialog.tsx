
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TeacherForm, type TeacherFormData } from './TeacherForm';
import type { Teacher } from '@/types';
import { format } from 'date-fns';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { addTeacherToFirestore } from '@/services/teacherService';
import { setUserRole } from '@/services/userService';

interface AddTeacherDialogProps {
  onTeacherAdded: () => void; 
  children: React.ReactNode;
}

export function AddTeacherDialog({ onTeacherAdded, children }: AddTeacherDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error("Failed to create Firebase user for teacher.");
      }
      const uid = firebaseUser.uid;

      // 2. Prepare teacher profile data for Firestore
      const teacherProfileData: Omit<Teacher, 'id'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        subject: data.subject,
        dateOfJoining: format(data.dateOfJoining, "yyyy-MM-dd"),
      };

      // 3. Add teacher profile to 'teachers' collection using UID as document ID
      await addTeacherToFirestore(uid, teacherProfileData);

      // 4. Set user role in 'users' collection
      await setUserRole(uid, data.email, 'teacher');
      
      toast({
        title: "Teacher Added Successfully",
        description: `${data.firstName} ${data.lastName} has been added and their account created.`,
      });
      onTeacherAdded(); 
      setIsOpen(false);

    } catch (error: any) {
      console.error("Error adding teacher:", error);
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
        title: "Failed to Add Teacher",
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
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new teacher and create their login credentials.
          </DialogDescription>
        </DialogHeader>
        <TeacherForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
            isEditMode={false}
        />
      </DialogContent>
    </Dialog>
  );
}
