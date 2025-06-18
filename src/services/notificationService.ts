
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import type { NotificationItem, NotificationType } from '@/types';
import type { NotificationFormData } from '@/components/notifications/NotificationForm';

const notificationsCollectionRef = collection(db, 'notifications');

interface NotificationDocumentData {
  title: string;
  description: string;
  type: NotificationType;
  createdAt: Timestamp; 
  // 'read' status is typically per-user and would be managed differently
  // For a global feed, we don't store 'read' in the main notification document
}

const fromFirestore = (docSnap: any): NotificationItem => {
  const data = docSnap.data() as NotificationDocumentData;
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    type: data.type,
    date: data.createdAt.toDate().toISOString(), // Convert Timestamp to ISO string
    read: false, // Default to false on client-side, read status is not stored globally
  };
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const q = query(notificationsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    throw new Error("Failed to fetch notifications.");
  }
};

export const addNotificationToFirestore = async (notificationData: NotificationFormData): Promise<Omit<NotificationItem, 'read'>> => {
  try {
    const dataToSave: Omit<NotificationDocumentData, 'createdAt'> & { createdAt: Timestamp } = {
      title: notificationData.title,
      description: notificationData.description,
      type: notificationData.type,
      createdAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(notificationsCollectionRef, dataToSave);
    
    // To return the full NotificationItem, we'd ideally fetch the doc again to get the serverTimestamp
    // For simplicity here, we'll construct it based on input and new ID, assuming createdAt will be populated.
    // A more robust approach might refetch or pass back the resolved serverTimestamp if critical.
    return {
      id: docRef.id,
      title: notificationData.title,
      description: notificationData.description,
      type: notificationData.type,
      date: new Date().toISOString(), // Placeholder, actual value is server-generated
    };
  } catch (error) {
    console.error("Error adding notification: ", error);
    throw new Error("Failed to add notification.");
  }
};
