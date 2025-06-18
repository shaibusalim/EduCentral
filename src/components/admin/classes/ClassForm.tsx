
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const classFormSchema = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters."),
  assignedTeacherName: z.string().min(2, "Teacher's name must be at least 2 characters."),
  roomNumber: z.string().optional(),
});

export type ClassFormData = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ClassFormData>;
  isLoading?: boolean;
}

export function ClassForm({ onSubmit, onCancel, defaultValues, isLoading }: ClassFormProps) {
  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      assignedTeacherName: '',
      roomNumber: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grade 10A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignedTeacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Teacher's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ms. Emily Clark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Room 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Saving...' : 'Save Class'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
