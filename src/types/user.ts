
export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password?: string;
  fname: string;
  lname: string;
  plan: "freemium" | "premium" | "pro";
  gender: "male" | "female";
  dob?: Date;
  startedPracticing?: Date;
  hidden?: boolean;
  validationToken?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: Date | null;
  status: "active" | "inactive";
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
  nationality?: string;
  country?: string;
  build?: string;
  appearance?: string;
  maritalStatus?: string;
  patternOfSalaah?: string;
  genotype?: string;
  summary?: string;
  workEducation?: string;
  lastSeen?: Date;
  favorites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
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
