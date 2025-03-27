// src/services/websocket.ts
import { useNotificationStore } from '@/stores/modules/notifications'
import { POSITION, useToast } from 'vue-toastification'

interface Notification {
  id: string
  message: string
  createdAt: string
  read: boolean
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private notificationStore: ReturnType<typeof useNotificationStore>;
  private toast = useToast();

  constructor() {
    this.notificationStore = useNotificationStore();
  }

  connect(url: string, token: string) {
    this.socket = new WebSocket(`${url}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data: Notification = JSON.parse(event.data);
      console.log('Received notification:', data);
      this.notificationStore.addNotification(data);
      // Hiển thị toast khi có thông báo mới
      this.toast.info(data.message, {
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
      });
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(url, token), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }
}

export const webSocketService = new WebSocketService();
