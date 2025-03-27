// src/stores/modules/notifications.ts
import { defineStore } from 'pinia';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

export const useNotificationStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [
      // Dữ liệu giả lập
      { id: 1, title: 'New Lead', message: 'A new lead has been assigned to you.', read: false },
      { id: 2, title: 'Meeting Reminder', message: 'Meeting with HUY LE at 04:33 PM.', read: false },
      { id: 3, title: 'Task Due', message: 'Task "Gặp mặt" is due today.', read: false },
    ],
  }),

  getters: {
    unreadNotifications(state): number {
      return state.notifications.filter((notif) => !notif.read).length;
    },
  },

  actions: {
    markAsRead(id: number) {
      const notif = this.notifications.find((n) => n.id === id);
      if (notif) {
        notif.read = true;
      }
    },
  },
});
