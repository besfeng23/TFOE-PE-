
import type { Timestamp } from "firebase/firestore";

export type MembershipStatus = 'APPLICANT' | 'INCUBATING' | 'INDOCTRINATING' | 'INDUCTED' | 'SUSPENDED' | 'EXPELLED';
export type DuesStatus = 'Paid' | 'Pending' | 'Overdue';
export type AppRole = 'Member' | 'Secretary' | 'President' | 'Governor' | 'Admin';
export type PositionType = 'Elected' | 'Appointed' | 'Volunteer' | 'None';

export interface UserProfile {
    // Core Identity
    id: string; // Firebase Auth UID
    email: string;
    firstName: string;
    lastName: string;

    // Membership & Status
    status: MembershipStatus;
    roleId: AppRole;
    points?: number;
    dues_status?: DuesStatus;
    magna_carta_version?: string;

    // Organizational Hierarchy
    clubId: string;
    regionId: string;

    // Financial
    damayan_wallet_balance?: number;

    // Security & Identity
    last_known_counter?: number; // For NTAG424 DNA card
    idPhotoUrl?: string;
    
    // Optional / Legacy Fields
    contactInfo?: string;
    membershipNumber?: string;
    assignedGovernmentPosition?: string;
    governmentBranch?: string;
    membershipStatus?: 'Active' | 'Inactive' | 'Leadership';
    positionType?: PositionType;
    avatarUrl?: string;
}

export interface Region {
    id: string;
    name: string;
    governorId: string;
}

export interface Club {
    id: string;
    name: string;
    regionId: string;
    presidentId: string;
    secretaryId: string;
    xendit_sub_account_id: string;
}

export interface Transaction {
    id: string;
    userId: string;
    type: 'Dues' | 'Donation' | 'AlalayangAgilaDebit' | 'AlalayangAgilaPayout';
    amount: number;
    timestamp: Timestamp;
    xendit_invoice_id?: string;
    related_entity_id?: string;
}

export interface Governance {
    id: string;
    min_points_for_induction: number;
    alalayang_agila_levy_amount: number;
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
    content?: string;
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
