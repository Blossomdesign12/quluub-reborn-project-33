
export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
  plan?: string;
  gender: "male" | "female";
  dob?: string | Date;
  startedPracticing?: string | Date;
  hidden?: boolean;
  status?: string;
  type?: string;
  validationToken?: string;
  referralCode?: string;
  referredBy?: string;
  referralStatus?: string;
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    completedReferrals: number;
  };
  videoCallCredits?: number;
  waliDetails?: string;
  kunya?: string;
  nationality?: string;
  country?: string;
  region?: string;
  build?: string;
  appearance?: string;
  maritalStatus?: string;
  noOfChildren?: string;
  ethnicity?: string;
  patternOfSalaah?: string;
  genotype?: string;
  summary?: string;
  workEducation?: string;
  lastSeen?: Date;
  favorites?: string[];
  traits?: string;
  revert?: string;
  scholarsSpeakers?: string;
  height?: string;
  weight?: string;
  emailVerified?: boolean;
  profile_pic?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
  gender: "male" | "female";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ConnectionRequest {
  _id: string;
  relationship: {
    id: string;
    status: string;
  };
  fname: string;
  lname: string;
  country?: string;
  profile_pic?: string;
}

export interface Chat {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  user: User;
  lastMessage?: Chat;
  unreadCount: number;
}

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  photoUrl: string;
  tags: string[];
  userId: string;
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
}

export interface VideoCallSettings {
  duration: number; // in minutes
  participants: User[];
  callId: string;
}
