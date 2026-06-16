export interface PastProject {
  id: string;
  title: string;
  author: string;
  year: string;
  grade: number;
  description: string;
  tags: string[];
  isLocked: boolean;
  fileUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const PAST_PROJECTS: PastProject[] = [];
