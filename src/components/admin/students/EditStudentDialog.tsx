
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
  onStudentUpdated: (updatedStudentData: Omit<StudentFormData, 'password' | 'email'>) => void; // Password and email not edited here
}

export function EditStudentDialog({ 
  isOpen, 
  onOpenChange, 
  studentToEdit, 
  onStudentUpdated 
}: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // The data submitted from the form might include email and password fields
  // (though they might be disabled or not present for edit mode).
  // We only want to pass relevant, editable fields to onStudentUpdated.
  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Exclude email and password from the data passed for update
    const { email, password, ...editableData } = data;
    
    onStudentUpdated(editableData);
    setIsLoading(false);
    onOpenChange(false); 
  };

  // Ensure defaultValues are correctly formatted for the form
  // For edit mode, password should not be pre-filled or editable through this form.
  // Email is shown but disabled.
  const defaultValuesForForm: Partial<StudentFormData> = {
    ...studentToEdit,
    dateOfBirth: studentToEdit.dateOfBirth ? parseISO(studentToEdit.dateOfBirth) : new Date(),
    password: '', // Explicitly clear password for edit form
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogDescription>
            Update the student's profile information below. Email cannot be changed. Password is managed separately.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValuesForForm}
            isLoading={isLoading}
            isEditMode={true} // Indicate edit mode to the form
        />
      </DialogContent>
    </Dialog>
  );
}
