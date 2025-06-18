
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

export const subjectFormSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters."),
});

export type SubjectFormData = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<SubjectFormData>;
  isLoading?: boolean;
}

export function SubjectForm({ onSubmit, onCancel, defaultValues, isLoading }: SubjectFormProps) {
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: '',
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
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics" {...field} />
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
            {isLoading ? 'Saving...' : 'Save Subject'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
