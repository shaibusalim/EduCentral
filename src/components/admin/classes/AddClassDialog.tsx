
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
import type { ClassItem } from '@/types';

interface AddClassDialogProps {
  onClassAdded: (newClass: Omit<ClassItem, 'id'>) => void;
  children: React.ReactNode;
}

export function AddClassDialog({ onClassAdded, children }: AddClassDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onClassAdded(data);
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
        />
      </DialogContent>
    </Dialog>
  );
}
