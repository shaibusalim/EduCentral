
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
import { StudentForm, type StudentFormData } from './StudentForm';
import type { Student } from '@/types';
import { format } from 'date-fns';

interface AddStudentDialogProps {
  onStudentAdded: (newStudent: Omit<Student, 'id'>) => void;
  children: React.ReactNode; // This will be the trigger button
}

export function AddStudentDialog({ onStudentAdded, children }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onStudentAdded({
      ...data,
      dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"), // Format date to string
    });
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student to the system.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
