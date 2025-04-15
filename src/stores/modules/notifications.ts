// src/stores/modules/notifications.ts
import type { ApiNotification } from '@/services/repositories/notification'
import { NotificationRepository } from '@/services/repositories/notification'
import { formatDistanceToNow } from 'date-fns'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  relatedUrl?: string
}

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  error: string | null
}

function formatTimestamp(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (e) {
    console.error('Error formatting date:', e)
    return timestamp // Fallback to original string
  }
}

export const useNotificationStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [
      {
        id: 1,
        title: 'New Lead',
        message: 'A new lead has been assigned to you.',
        time: '2h ago',
        read: true,
      },
      {
        id: 2,
        title: 'Meeting Reminder',
        message: 'Meeting with Nhan Tran',
        time: 'Today at 9:30 am',
        read: true,
      },
      {
        id: 3,
        title: 'Task Due',
        message: 'Task "Gặp mặt" is due today.',
        time: 'Today at 2:30 pm',
        read: false,
      },
      {
        id: 4,
        title: 'Call Reminder',
        message: 'Scheduled call with Thanh Nhan',
        time: '5 minutes left',
        read: true,
      },
      {
        id: 5,
        title: 'Task Assignment',
        message: 'A task has been assigned in you',
        time: 'Sep 12 at 10:54 am',
        read: false,
      },
    ],
    loading: false,
    error: null,
  }),

  getters: {
    unreadNotifications(state): number {
      return state.notifications.filter((notif) => !notif.read).length
    },
  },

  actions: {
    async fetchNotifications() {
      if (this.loading) return // Prevent multiple simultaneous fetches
      this.loading = true
      this.error = null
      const toast = useToast()
      const repository = new NotificationRepository()

      try {
        const response = await repository.show()
        const apiNotifications = response.results || []

        this.notifications = apiNotifications.map(
          (apiNotif: ApiNotification): Notification => ({
            id: apiNotif.id,
            title: apiNotif.title,
            message: apiNotif.message,
            time: formatTimestamp(apiNotif.timestamp),
            read: apiNotif.is_read,
            relatedUrl: apiNotif.related_object_url,
          }),
        )
      } catch (error: any) {
        console.error('Failed to fetch notifications:', error)
        this.error = error.message || 'Could not load notifications.'
        toast.error(this.error)
        this.notifications = []
      } finally {
        this.loading = false
      }
    },

    markAsRead(id: number) {
      const notif = this.notifications.find((n) => n.id === id)
      if (notif) {
        notif.read = true

        // try {
        //   const repository = new NotificationRepository();
        //   await repository.markAsRead(id);
        // } catch (error) {
        //   console.error('Failed to mark notification as read:', error);
        //   notif.read = false; // Revert UI on error
        ////    Show error toast
        // }
      }
    },

    markAllAsRead() {
      this.notifications.forEach((notif) => {
        notif.read = true
      })

      // try {
      //   const repository = new NotificationRepository();
      //   await repository.markAllAsRead();
      // } catch (error) {
      //   console.error('Failed to mark all notifications as read:', error);
      //   // Revert UI for affected notifications on error
      //   this.notifications.forEach((notif) => {
      //     if (unreadIds.includes(notif.id)) {
      //       notif.read = false;
      //     }
      //   });
      //   // Show error toast
      // }
    },
  },
})
