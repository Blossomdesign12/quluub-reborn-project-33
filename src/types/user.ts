
export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password?: string;
  fname: string;
  lname: string;
  plan: "freemium" | "premium" | "pro" | null;
  gender: "male" | "female";
  dob?: Date | string;
  startedPracticing?: Date | string;
  hidden?: boolean;
  validationToken?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: Date | string | null;
  status: "active" | "inactive" | "NEW";
  type?: "REGULAR" | "NEW";
  referralCode?: string;
  referredBy?: string;
  referralStatus?: 'Pending' | 'Verified' | 'Rejected';
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
  lastSeen?: Date | string;
  favorites?: string[];
  createdAt?: string;
  updatedAt?: string;
  profile_pic?: string | null;
  height?: string | null;
  weight?: string | null;
  revert?: string | null;
  sect?: string | null;
  scholarsSpeakers?: string | null;
  dressingCovering?: string | null;
  islamicPractice?: string | null;
  otherDetails?: string | null;
  traits?: string | null;
  openToMatches?: string | null;
  dealbreakers?: string | null;
  icebreakers?: string | null;
  created?: string;
  updated?: string;
  deleted?: string | null;
  sessionId?: string | null;
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
  user: User;
  token: string;
}

export interface Relationship {
  id: string;
  follower_user_id: string;
  followed_user_id: string;
  status: "pending" | "rejected" | "matched";
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: "UNREAD" | "READ";
  created: string;
  updated: string;
}

export interface UserActivityLog {
  _id: string;
  userId: string;
  receiverId: string;
  action: "VIEWED" | "FOLLOWED" | "REJECTED" | "WITHDREW";
  created: string;
}

export interface WaliChat {
  _id: string;
  token: string;
  wardid: string;
  wardcontactid: string;
  createdAt: string;
  updatedAt: string;
}
