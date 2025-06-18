
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassForm, type ClassFormData } from './ClassForm';
import type { ClassItem } from '@/types';

interface EditClassDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  classToEdit: ClassItem; // ClassItem now has assignedTeacherId
  onClassUpdated: (updatedClassData: ClassFormData) => void; // Submits ClassFormData
}

export function EditClassDialog({ 
  isOpen, 
  onOpenChange, 
  classToEdit, 
  onClassUpdated 
}: EditClassDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    // The actual Firestore call is now in the parent page
    onClassUpdated(data);
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Keep for simulation if desired
    setIsLoading(false);
    onOpenChange(false);
  };

  // Prepare default values for the form, ensuring assignedTeacherId is passed
  const formDefaultValues: Partial<ClassFormData> = {
    name: classToEdit.name,
    assignedTeacherId: classToEdit.assignedTeacherId || null, // Ensure it's null if undefined
    roomNumber: classToEdit.roomNumber,
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Class Details</DialogTitle>
          <DialogDescription>
            Update the class information below.
          </DialogDescription>
        </DialogHeader>
        <ClassForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={formDefaultValues}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
