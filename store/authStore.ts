import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user }),
  
  setToken: (token) => set({ token }),

  login: async (token, user) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      set({ 
        token: null, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        set({ 
          token, 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },
}));