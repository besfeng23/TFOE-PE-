
import type { Timestamp } from "firebase/firestore";

export type MembershipStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deceased';
export type PositionType = 'Elected' | 'Appointed' | 'Volunteer' | 'None';
export type FiveIsStage = 'Interview' | 'Introduction' | 'Initiation' | 'Incubation' | 'Induction';

export interface UserProfile {
    // Core Fields
    id: string; // Firebase Auth UID
    eagleId?: string; // Unique Eagle ID
    email: string;
    mobileNumber?: string;
    firstName: string;
    lastName: string;

    // Org Structure
    councilName?: string;
    clubName?: string;
    region?: string;
    nationalPosition?: string;
    roleId: string; // App Role: Member, ClubAdmin, CouncilAdmin, SuperAdmin

    // Government Role
    governmentRole?: string;
    governmentBranch?: string;
    barangayName?: string;
    municipalityCity?: string;
    province?: string;
    
    // Status & Timestamps
    status?: MembershipStatus;
    joinedDate?: Timestamp;
    lastUpdatedAt?: Timestamp;

    // Metadata
    tags?: string[];
    avatarUrl?: string; // from Cloud Storage
    idPhotoUrl?: string; // from Cloud Storage

    // Eagles-specific
    eagleTitle?: 'Kuya' | 'Ate';
    membershipType?: 'Regular' | 'Bunso/Aspirant' | 'Friend';
    fiveIsStage?: FiveIsStage;

    // Deprecated / To be refactored from old schema
    membershipNumber?: string;
    contactInfo?: string;
    assignedGovernmentPosition?: string;
    membershipStatus?: MembershipStatus;
    positionType?: PositionType;
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

export interface Attendance {
    id: string;
    eventId: string;
    userId: string;
    attended: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Timestamp;
    endDate: Timestamp;
    location: string;
    meetingId?: string;
    passcode?: string;
}

export interface Partnership {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone?: string;
    address?: string;
    partnershipType: 'Corporate' | 'NGO' | 'Private';
    status: 'Active' | 'Inactive';
}

export interface Endorsement {
    id: string;
    partnershipId: string;
    subject: string;
    body: string;
    generatedDate: Timestamp;
    generatedByUserId: string;
}

export interface Conversation {
    id: string;
    participants: string[];
    participantDetails: {
        userId: string;
        name: string;
        photoUrl?: string;
    }[];
    lastMessage?: {
        text: string;
        timestamp: Timestamp;
        senderId: string;
    };
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
}
