export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  dateOfBirth: Date;
  hometown: string;
  currentCity: string;
  university?: string;
  profession?: string;
  interests: string[];
  userType: UserType;
  isVerified: boolean;
  joinedDate: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export enum UserType {
  STUDENT = 'student',
  PROFESSIONAL = 'professional',
  ENTREPRENEUR = 'entrepreneur',
  OTHER = 'other'
}

export interface ProfileSetupData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  hometown: string;
  currentCity: string;
  university?: string;
  profession?: string;
  interests: string[];
  userType: UserType;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}