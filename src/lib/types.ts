

import type { LucideIcon } from "lucide-react";
import type { User as FirebaseUser } from 'firebase/auth';
import type { GeoPoint, Timestamp } from "firebase/firestore";
import type { AssessDamageOutput } from "@/ai/flows/assess-damage-flow";
export type { Notification, ApiStatus } from "@/app/types/notification";


export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  affectedAreas: string[];
  type: "Cyclone" | "Flood" | "Earthquake" | "Fire" | "Other";
  timestamp: Timestamp;
  createdBy: string;
  location?: GeoPoint;
  acknowledged?: boolean;
  rescueStatus?: 'Dispatched' | 'In Progress' | 'Completed' | null;
  rescueTeam?: string;
  eta?: string;
};

export type GovernmentAdvisory = {
  id: number;
  title: string;
  agency: "National Disaster Management Authority (NDMA)" | "India Meteorological Department (IMD)";
  date: string;
  summary: string;
  type: "Cyclone" | "Flood" | "Earthquake" | "Weather" | "Other";
  severity: "Warning" | "Watch" | "Advisory";
}

export type StatusUpdate = {
  id: string;
  userName: string;
  userAvatarUrl: string;
  timestamp: string;
  message: string;
};

export type UserStatus = {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string;
    status: 'safe' | 'help';
    location?: GeoPoint;
    timestamp: Timestamp;
};

export type ResourceNeed = {
    id?: string;
    userId: string;
    item: 'Food' | 'Water' | 'Medicine' | 'Shelter';
    quantity: number;
    urgency: 'Low' | 'Medium' | 'High';
    location: GeoPoint | null;
    contactInfo: string;
    fulfilled: boolean;
    timestamp: any; // Using 'any' for serverTimestamp compatibility
}

export type ResourceOffer = {
    id: string;
    userId: string;
    item: 'Food' | 'Water' | 'Medicine' | 'Shelter';
    quantity: number;
    location: GeoPoint;
    contactInfo: string;
    timestamp: Timestamp;
}

export type DamageReport = {
    id?: string;
    userId: string;
    description: string;
    imageUrl: string;
    location?: GeoPoint;
    assessment: AssessDamageOutput;
    timestamp: any;
}

export type MissingPerson = {
    id?: string;
    reportedBy: string;
    name: string;
    age: number;
    lastSeenLocation: string;
    contactInfo: string;
    photoUrl: string; // URL from Firebase Storage
    faceEmbedding: number[];
    timestamp: any;
}

export type Feedback = {
    id?: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: any;
}

export type SurvivorStory = {
    id?: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string;
    title: string;
    story: string;
    mediaUrl?: string; // For now, one image. Can be extended to an array.
    heroName?: string;
    heroContact?: string;
    timestamp: any;
}

// Insurance-related types translated from Python models
export enum PolicyStatus {
    ACTIVE = "active",
    PENDING = "pending",
    EXPIRED = "expired",
    CLAIMED = "claimed",
}

export enum ClaimStatus {
    REPORTED = "reported",
    ASSESSING = "assessing",
    APPROVED = "approved",
    PAID = "paid",
    REJECTED = "rejected",
}

export interface InsurancePolicy {
    policyId: string;
    userId: string;
    premiumAmount: number;
    coverageAmount: number;
    startDate: Timestamp;
    endDate: Timestamp;
    status: PolicyStatus;
    propertyDetails: Record<string, any>;
    riskAssessment?: Record<string, any>;
}

export interface InsuranceDamageAssessment {
    assessmentId: string;
    policyId: string;
    fireIncidentId: string; // Assuming this relates to a specific event ID
    damageScore: number; // 0-1 scale
    estimatedLoss: number;
    assessmentMethod: "sensor" | "satellite" | "manual" | "ai_visual";
    confidenceLevel: number;
    evidenceData: Record<string, any>; // For sensor data, images, etc.
    assessedBy: "ai_system" | string; // 'ai_system' or adjuster's ID
    timestamp: Timestamp;
}

export interface InsuranceClaim {
    claimId: string;
    policyId: string;
    assessmentId: string;
    claimAmount: number;
    status: ClaimStatus;
    filedDate: Timestamp;
    processedDate?: Timestamp;
    payoutAmount?: number;
    governmentSubsidy?: number;
}


export type Resource = {
  id: string;
  name: string;
  type: "Shelter" | "Hospital" | "Food & Water" | "Help Center" | "Hotel";
  address: string;
  position: { lat: number; lng: number };
  icon: string;
};

export type EmergencyContact = {
  id:string;
  name: string;
  description: string;
  phone: string;
  icon: string;
};

export type AlertSource = {
  id: string;
  name: string;
  description: string;
};

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  createdAt: Date;
}

export type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
