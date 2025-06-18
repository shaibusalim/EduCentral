
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TeacherForm, type TeacherFormData } from './TeacherForm';
import type { Teacher } from '@/types';
import { parseISO } from 'date-fns';

interface EditTeacherDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teacherToEdit: Teacher;
  onTeacherUpdated: (updatedTeacherData: Omit<TeacherFormData, 'password' | 'email'>) => void;
}

export function EditTeacherDialog({ 
  isOpen, 
  onOpenChange, 
  teacherToEdit, 
  onTeacherUpdated 
}: EditTeacherDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const { email, password, ...editableData } = data;
    onTeacherUpdated(editableData);
    setIsLoading(false);
    onOpenChange(false);
  };

  const defaultValuesForForm: Partial<TeacherFormData> = {
    ...teacherToEdit,
    dateOfJoining: teacherToEdit.dateOfJoining ? parseISO(teacherToEdit.dateOfJoining) : new Date(),
    password: '', // Clear password for edit form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher Details</DialogTitle>
          <DialogDescription>
            Update the teacher's profile information below. Email cannot be changed. Password is managed separately.
          </DialogDescription>
        </DialogHeader>
        <TeacherForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValuesForForm}
            isLoading={isLoading}
            isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
}
