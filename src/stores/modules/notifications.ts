// src/stores/modules/notifications.ts
import { defineStore } from 'pinia';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

export const useNotificationStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [],
  }),

  getters: {
    unreadNotifications(state): number {
      return state.notifications.filter((n) => !n.read).length;
    },
    allNotifications(state): Notification[] {
      return state.notifications;
    },
  },

  actions: {
    addNotification(notification: Notification) {
      this.notifications.unshift(notification); // Thêm thông báo mới vào đầu danh sách
    },

    markAsRead(notificationId: string) {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },

    markAllAsRead() {
      this.notifications.forEach((n) => (n.read = true));
    },

    clearNotifications() {
      this.notifications = [];
    },
  },
});
