import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.handleReconnect();
    });

    this.socket.on('new_message', (message) => {
      useChatStore.getState().addMessage(message.chatId, message);
    });

    this.socket.on('typing', ({ chatId, userId, isTyping }) => {
      useChatStore.getState().setTyping(chatId, isTyping);
    });

    this.socket.on('match_notification', (match) => {
      // Handle new match notification
      console.log('New match:', match);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('join_chat', chatId);
    }
  }

  leaveChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('leave_chat', chatId);
    }
  }

  sendMessage(chatId: string, message: string) {
    if (this.socket) {
      this.socket.emit('send_message', { chatId, message });
    }
  }

  sendTyping(chatId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }
}

export const socketService = new SocketService();