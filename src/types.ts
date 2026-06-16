import { Timestamp } from 'firebase/firestore';

export enum Criterion {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type SectionType = 'goal' | 'product' | 'criteria' | 'planning' | 'skills' | 'reflection';

export interface Project {
  id: string;
  title: string;
  studentId: string;
  studentEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  band7Mode: boolean;
}

export interface Section {
  id: string; // matches sectionType
  projectId: string;
  content: string;
  checklist: Record<string, boolean>;
  status: 'missing' | 'needs_improvement' | 'strong';
  lastUpdated: Timestamp;
}

export interface MentorPrompt {
  id: string;
  projectId: string;
  sectionId: SectionType;
  questions: string[];
  mindMapNodes?: string[];
  gapDetection?: string;
  timestamp: Timestamp;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
