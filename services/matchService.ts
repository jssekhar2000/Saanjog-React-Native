import api from './api';
import { User, Match, UserPreferences } from '../types/user';

export const matchService = {
  getMatches: async (filters?: Partial<UserPreferences>): Promise<User[]> => {
    const response = await api.get('/matches', { params: filters });
    return response.data;
  },

  likeProfile: async (userId: string): Promise<{ mutual: boolean; match?: Match }> => {
    const response = await api.post(`/matches/${userId}/like`);
    return response.data;
  },

  passProfile: async (userId: string): Promise<void> => {
    await api.post(`/matches/${userId}/pass`);
  },

  getMutualMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/mutual');
    return response.data;
  },

  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/matches/${userId}/profile`);
    return response.data;
  },

  reportProfile: async (userId: string, reason: string): Promise<void> => {
    await api.post(`/matches/${userId}/report`, { reason });
  },

  blockProfile: async (userId: string): Promise<void> => {
    await api.post(`/matches/${userId}/block`);
  },
};