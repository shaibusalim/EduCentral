
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
import { SubjectForm, type SubjectFormData } from './SubjectForm';
import type { SubjectItem } from '@/types';

interface AddSubjectDialogProps {
  onSubjectAdded: (newSubject: Omit<SubjectItem, 'id'>) => void;
  children: React.ReactNode;
}

export function AddSubjectDialog({ onSubjectAdded, children }: AddSubjectDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: SubjectFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubjectAdded(data);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new subject.
          </DialogDescription>
        </DialogHeader>
        <SubjectForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
