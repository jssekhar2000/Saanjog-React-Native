import api from './api';
import { Chat, Message } from '../types/user';

export const chatService = {
  getChats: async (): Promise<Chat[]> => {
    const response = await api.get('/chats');
    return response.data;
  },

  getMessages: async (chatId: string): Promise<Message[]> => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: string, content: string): Promise<Message> => {
    const response = await api.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  },

  markAsRead: async (chatId: string): Promise<void> => {
    await api.put(`/chats/${chatId}/read`);
  },

  createChat: async (participantId: string): Promise<Chat> => {
    const response = await api.post('/chats', { participantId });
    return response.data;
  },
};