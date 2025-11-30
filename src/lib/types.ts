import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipNumber?: string;
    idPhotoUrl?: string;
    contactInfo?: string;
    roleId: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Document {
    id: string;
    title: string;
    fileUrl: string;
    categoryId: string;
    uploadDate: Timestamp;
    version: number;
    uploadedByUserId: string;
    content?: string; // For summarization demo
}
