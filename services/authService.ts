import api from './api';
import { User } from '../types/user';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

export const authService = {
  sendOTP: async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await api.post('/auth/send-otp', { phoneNumber });
    return response.data;
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
    return response.data;
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  uploadPhoto: async (photoUri: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
console.log(formData,'-----');
    const response = await api.post('/upload/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response,'----------');
    return response.data;
  },
};