
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
  classToEdit: ClassItem;
  onClassUpdated: (updatedClassData: ClassFormData) => void;
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onClassUpdated(data);
    setIsLoading(false);
    onOpenChange(false);
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
            defaultValues={classToEdit}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
