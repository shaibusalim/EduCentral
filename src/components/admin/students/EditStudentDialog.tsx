
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
import { parseISO } from 'date-fns';

interface EditStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentToEdit: Student;
  onStudentUpdated: (updatedStudentData: StudentFormData) => void;
}

export function EditStudentDialog({ 
  isOpen, 
  onOpenChange, 
  studentToEdit, 
  onStudentUpdated 
}: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onStudentUpdated(data);
    setIsLoading(false);
    onOpenChange(false); // Close dialog on successful update
  };

  // Ensure defaultValues are correctly formatted for the form, especially the date
  const defaultValuesForForm = {
    ...studentToEdit,
    dateOfBirth: studentToEdit.dateOfBirth ? parseISO(studentToEdit.dateOfBirth) : new Date(),
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogDescription>
            Update the student's information below.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValuesForForm}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
