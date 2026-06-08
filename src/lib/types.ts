
export type MembershipStatus = 'APPLICANT' | 'INCUBATING' | 'INDOCTRINATING' | 'INDUCTED' | 'SUSPENDED' | 'EXPELLED';
export type DuesStatus = 'Paid' | 'Pending' | 'Overdue';
export type AppRole = 'SuperAdmin' | 'RegionAdmin' | 'CouncilAdmin' | 'ClubAdmin' | 'Member' | 'Guest';
export type PositionType = 'Elected' | 'Appointed' | 'Volunteer' | 'None';
export type MemberStatus = "Active" | "Inactive" | "Suspended" | "Expelled" | "Deceased";

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
    councilName?: string;
    clubName?: string;

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

export interface Member {
    id: string;
    fullName: string;
    eagleId: string;
    email: string;
    mobileNumber: string;
    region: string;
    councilName: string;
    clubName: string;
    orgRole: string;
    governmentRole: string;
    governmentBranch: string;
    barangayName: string;
    municipalityCity: string;
    province: string;
    status: MemberStatus;
    joinedDate: Date;
    membershipType: string;
    tags: string[];
    fiveIsStage: string;
    avatarUrl: string;
    lastUpdatedAt: Date;
    searchKeywords: string[];
}

export type ApplicationFiveIsStage = "Applicant" | "Interview" | "Indoctrination" | "Initiation" | "Induction" | "Completed";
export type ApplicationStatus = "In Progress" | "On Hold" | "Returned" | "Rejected" | "Approved" | "ConvertedToMember";

export interface Application {
    id: string;
    applicantFullName: string;
    applicantEmail: string;
    applicantMobileNumber: string;
    applicantAddress: string;
    barangayName: string;
    municipalityCity: string;
    province: string;
    sponsoringClubId: string;
    sponsoringClubName: string;
    sponsorMemberId: string;
    sponsorName: string;
    fiveIsStage: ApplicationFiveIsStage;
    status: ApplicationStatus;
    stageDates: { [key: string]: Date };
    region: string;
    councilName: string;
    clubName: string;
    clearances: { [key: string]: boolean };
    documents: {
        type: string;
        url: string;
        uploadedAt: Date;
        uploadedBy: string;
    }[];
    linkedMemberId: string | null;
    currentHandlerLevel: "Club" | "Region" | "National";
    createdByUserId: string;
    createdAt: Date;
    updatedAt: Date;
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
    timestamp: Date;
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
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Document {
    id: string;
    title: string;
    fileUrl: string;
    categoryId: string;
    uploadDate: Date;
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
    startDate: Date;
    endDate?: Date;
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
    generatedDate: Date;
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
        timestamp: Date;
        senderId: string;
    };
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}
