export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  religion: string;
  caste: string;
  subCaste?: string;
  education: string;
  profession: string;
  income?: string;
  height: string;
  maritalStatus: 'never_married' | 'divorced' | 'widowed';
  city: string;
  state: string;
  country: string;
  photos: string[];
  profilePicture?: string;
  bio?: string;
  interests: string[];
  verified: boolean;
  premium: boolean;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  preferences: UserPreferences;
  privacy: PrivacySettings;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: string;
    max: string;
  };
  religions: string[];
  castes: string[];
  educations: string[];
  professions: string[];
  incomeRange?: {
    min: string;
    max: string;
  };
  maritalStatuses: string[];
  locations: {
    cities: string[];
    states: string[];
    radius: number; // in km
  };
}

export interface PrivacySettings {
  showPhotos: boolean;
  showContactInfo: boolean;
  showLastActive: boolean;
  blockedUsers: string[];
}

export interface Match {
  id: string;
  user: User;
  matchPercentage: number;
  matchedAt: string;
  status: 'pending' | 'liked' | 'passed' | 'mutual';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: string;
  read: boolean;
}