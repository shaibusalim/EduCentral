
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
import { TeacherForm, type TeacherFormData } from './TeacherForm';
import type { Teacher } from '@/types';
import { format } from 'date-fns';

interface AddTeacherDialogProps {
  onTeacherAdded: (newTeacher: Omit<Teacher, 'id'>) => void;
  children: React.ReactNode; // This will be the trigger button
}

export function AddTeacherDialog({ onTeacherAdded, children }: AddTeacherDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onTeacherAdded({
      ...data,
      dateOfJoining: format(data.dateOfJoining, "yyyy-MM-dd"), // Format date to string
    });
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new teacher to the system.
          </DialogDescription>
        </DialogHeader>
        <TeacherForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsOpen(false)}
            isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
