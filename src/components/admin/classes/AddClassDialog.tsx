
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
import { ClassForm, type ClassFormData } from './ClassForm';
// No longer need ClassItem type here as ClassFormData is used for submission

interface AddClassDialogProps {
  onClassAdded: (newClassData: ClassFormData) => void; // Changed from Omit<ClassItem, 'id'>
  children: React.ReactNode;
}

export function AddClassDialog({ onClassAdded, children }: AddClassDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    // Simulate API call if needed or directly call onClassAdded
    // The actual Firestore call is now in the parent page
    onClassAdded(data); 
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Keep for simulation if desired
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new class.
          </DialogDescription>
        </DialogHeader>
        <ClassForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
            // No defaultValues needed for Add dialog, form handles its own defaults
        />
      </DialogContent>
    </Dialog>
  );
}
