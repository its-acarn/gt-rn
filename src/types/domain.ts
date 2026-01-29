export type Role = 'User' | 'Admin';

export type EntityBase = {
  id: string;
  serverUpdatedAt?: string;
};

export type Course = EntityBase & {
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  stateRegion?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  isApproved: boolean;
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TeeBox = EntityBase & {
  courseId: string;
  name: string;
  parTotal?: number | null;
  yardageTotal?: number | null;
  slope?: number | null;
  rating?: number | null;
};

export type Visit = EntityBase & {
  userId: string;
  courseId: string;
  visitDate: string;
  holesPlayed: 9 | 18;
  grossScore?: number | null;
  teeBoxId?: string | null;
  teeName?: string | null;
  toPar?: number | null;
};

export type WishlistEntry = EntityBase & {
  userId: string;
  courseId: string;
  createdAt: string;
};

export type CourseSuggestion = EntityBase & {
  submittedByUserId: string;
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  stateRegion?: string | null;
  country: string;
  postalCode?: string | null;
  phone?: string | null;
  website?: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionBy?: string | null;
  decisionAt?: string | null;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  publicSlug: string;
};
