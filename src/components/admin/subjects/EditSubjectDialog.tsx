
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SubjectForm, type SubjectFormData } from './SubjectForm';
import type { SubjectItem } from '@/types';

interface EditSubjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectToEdit: SubjectItem;
  onSubjectUpdated: (updatedSubjectData: SubjectFormData) => void;
}

export function EditSubjectDialog({ 
  isOpen, 
  onOpenChange, 
  subjectToEdit, 
  onSubjectUpdated 
}: EditSubjectDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: SubjectFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubjectUpdated(data);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Subject Details</DialogTitle>
          <DialogDescription>
            Update the subject information below.
          </DialogDescription>
        </DialogHeader>
        <SubjectForm 
            onSubmit={handleSubmit} 
            onCancel={() => onOpenChange(false)}
            defaultValues={subjectToEdit}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
