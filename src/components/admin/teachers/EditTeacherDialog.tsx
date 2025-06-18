
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
  onTeacherUpdated: (updatedTeacherData: TeacherFormData) => void;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onTeacherUpdated(data);
    setIsLoading(false);
    onOpenChange(false); // Close dialog on successful update
  };

  const defaultValuesForForm = {
    ...teacherToEdit,
    dateOfJoining: teacherToEdit.dateOfJoining ? parseISO(teacherToEdit.dateOfJoining) : new Date(),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher Details</DialogTitle>
          <DialogDescription>
            Update the teacher's information below.
          </DialogDescription>
        </DialogHeader>
        <TeacherForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValuesForForm}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
