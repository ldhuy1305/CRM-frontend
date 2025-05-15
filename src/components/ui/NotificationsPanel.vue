<template>
  <div class="notifications-panel">
    <div class="notifications-header">
      <h2>Notifications</h2>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <div class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="markAsRead(notification.id)"
      >
        <div class="notification-content">
          <div class="notification-title">
            <strong>{{ notification.title }}</strong>
          </div>
          <div class="notification-message">
            <span>{{ notification.message }}</span>
          </div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>

      <div v-if="!notifications.length" class="no-notifications">No notifications to display</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useNotificationStore } from '@/stores/modules/notifications'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotificationsPanel',
  emits: ['close'],
  setup() {
    const notificationStore = useNotificationStore()
    const { notifications } = storeToRefs(notificationStore)
    const markAsRead = (id: number) => {
      notificationStore.markAsRead(id)
      // Optionally, you could navigate to the notification details here
    }

    return {
      notifications,
      markAsRead,
    }
  },
})
</script>

<style scoped>
.notifications-panel {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 380px;
  max-height: 80vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 1002;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.notifications-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 34px;
  cursor: pointer;
  color: #666;
}

.notifications-list {
  padding: 0;
}

.notification-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #ddeffa;
}

.notification-item.unread {
  background-color: #ddeffa;
  font-weight: 1000;
}

.notification-item.unread .notification-title {
  color: #ff6500;
  font-weight: 500;
}

.notification-content {
  flex: 1;
}

.notification-title {
  color: #ff6500;
  font-weight: 300;
}

.notification-message {
  margin-bottom: 4px;
  color: #333;
}

.notification-message strong {
  font-weight: 500;
}

.notification-time {
  font-size: 13px;
  color: #888;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #888;
}
</style>
