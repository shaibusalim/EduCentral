
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Teacher } from '@/types';
import { getTeachers } from '@/services/teacherService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const classFormSchema = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters."),
  assignedTeacherId: z.string().optional().nullable(),
  roomNumber: z.string().optional(),
});

export type ClassFormData = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ClassFormData & { assignedTeacherName?: string }>;
  isLoading?: boolean;
}

const NO_TEACHER_VALUE = "__NONE_TEACHER_ID__"; // Unique value for "None" option

export function ClassForm({ onSubmit, onCancel, defaultValues, isLoading }: ClassFormProps) {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchTeacherData = async () => {
      setIsLoadingTeachers(true);
      try {
        const fetchedTeachers = await getTeachers();
        setTeachers(fetchedTeachers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load teachers",
          description: (error as Error).message,
        });
      } finally {
        setIsLoadingTeachers(false);
      }
    };
    fetchTeacherData();
  }, [toast]);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      assignedTeacherId: defaultValues?.assignedTeacherId === undefined ? undefined : (defaultValues.assignedTeacherId || null),
      roomNumber: defaultValues?.roomNumber || '',
    },
  });
  
  React.useEffect(() => {
    form.reset({
      name: defaultValues?.name || '',
      assignedTeacherId: defaultValues?.assignedTeacherId === undefined ? undefined : (defaultValues.assignedTeacherId || null),
      roomNumber: defaultValues?.roomNumber || '',
    });
  }, [defaultValues, form]);


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
          name="assignedTeacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Teacher</FormLabel>
              <Select 
                onValueChange={(value) => {
                  if (value === NO_TEACHER_VALUE) {
                    field.onChange(null);
                  } else {
                    field.onChange(value);
                  }
                }} 
                value={field.value === null ? NO_TEACHER_VALUE : (field.value || "")} // Handles null, undefined, and string ID
                disabled={isLoadingTeachers || teachers.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                        isLoadingTeachers ? "Loading teachers..." : 
                        (teachers.length === 0 ? "No teachers available" : "Select a teacher (Optional)")
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingTeachers ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <SelectItem value={NO_TEACHER_VALUE}>
                        <em>None</em>
                      </SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
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
          <Button type="submit" disabled={isLoading || isLoadingTeachers} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Saving...' : 'Save Class'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
