import { create } from 'zustand';
import { Chat, Message } from '../types/user';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  isTyping: { [chatId: string]: boolean };
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: {},
  isTyping: {},

  setChats: (chats) => set({ chats }),
  
  setCurrentChat: (chat) => set({ currentChat: chat }),
  
  addMessage: (chatId, message) => {
    const { messages } = get();
    const chatMessages = messages[chatId] || [];
    set({
      messages: {
        ...messages,
        [chatId]: [...chatMessages, message]
      }
    });
  },

  setMessages: (chatId, messages) => {
    const { messages: allMessages } = get();
    set({
      messages: {
        ...allMessages,
        [chatId]: messages
      }
    });
  },

  setTyping: (chatId, isTyping) => {
    const { isTyping: currentTyping } = get();
    set({
      isTyping: {
        ...currentTyping,
        [chatId]: isTyping
      }
    });
  },
}));