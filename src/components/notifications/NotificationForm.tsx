
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { NotificationType } from '@/types';

export const notificationFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  type: z.enum(['announcement', 'alert', 'info'], {
    required_error: "Notification type is required.",
  }),
});

export type NotificationFormData = z.infer<typeof notificationFormSchema>;

interface NotificationFormProps {
  onSubmit: (data: NotificationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<NotificationFormData>;
}

export function NotificationForm({ onSubmit, onCancel, isLoading, defaultValues }: NotificationFormProps) {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'info',
      ...defaultValues,
    },
  });

  const notificationTypes: NotificationType[] = ['announcement', 'alert', 'info'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., School Closure Announcement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Detailed information about the notification..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Creating...' : 'Create Notification'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
