
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
import { NotificationForm, type NotificationFormData } from './NotificationForm';
import type { NotificationItem } from '@/types';

interface AddNotificationDialogProps {
  onNotificationAdded: (newNotificationData: NotificationFormData) => void;
  children: React.ReactNode; // Trigger element
}

export function AddNotificationDialog({ onNotificationAdded, children }: AddNotificationDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: NotificationFormData) => {
    setIsLoading(true);
    // Simulate API call or processing
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    onNotificationAdded(data);
    setIsLoading(false);
    setIsOpen(false); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new school-wide notification.
          </DialogDescription>
        </DialogHeader>
        <NotificationForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
