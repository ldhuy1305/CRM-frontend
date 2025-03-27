<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="UNIBEAM Logo" />
      <span>UNIBEAM</span>
    </div>

    <div class="header-right">
      <nav class="menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <button class="upgrade-btn">UPGRADE FREE</button>

      <div class="notification" @click="toggleNotificationDropdown">
        <i class="fas fa-bell"></i>
        <span v-if="unreadNotifications > 0" class="badge">{{ unreadNotifications }}</span>
        <div v-if="showNotificationDropdown" class="notification-dropdown">
          <div class="dropdown-header">
            <span>Notifications ({{ unreadNotifications }} unread)</span>
            <div>
              <button @click.stop="markAllAsRead" class="mark-all-read">Mark all as read</button>
              <button @click.stop="clearNotifications" class="clear-all">Clear all</button>
            </div>
          </div>
          <div v-if="allNotifications.length === 0" class="no-notifications">
            No notifications
          </div>
          <div v-else class="notification-list">
            <div
              v-for="notification in allNotifications"
              :key="notification.id"
              class="notification-item"
              :class="{ unread: !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="user-avatar" @click="toggleUserDropdown">
        <img src="@/assets/user-avatar.png" alt="User Avatar" />
        <div v-if="showUserDropdown" class="dropdown">
          <router-link to="/profile" class="dropdown-item" @click="closeUserDropdown">
            <i class="fas fa-user"></i> Profile
          </router-link>
          <router-link to="/settings" class="dropdown-item" @click="closeUserDropdown">
            <i class="fas fa-cog"></i> Settings
          </router-link>
          <div class="dropdown-item" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/modules/notifications';
import { useAuthStore } from '@/stores/modules/auth';

export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter();
    const notificationStore = useNotificationStore();
    const authStore = useAuthStore();

    const showNotificationDropdown = ref(false);
    const showUserDropdown = ref(false);

    const toggleNotificationDropdown = () => {
      showNotificationDropdown.value = !showNotificationDropdown.value;
      if (showNotificationDropdown.value) {
        showUserDropdown.value = false;
      }
    };

    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value;
      if (showUserDropdown.value) {
        showNotificationDropdown.value = false;
      }
    };

    const closeUserDropdown = () => {
      showUserDropdown.value = false;
    };

    const markAsRead = (notificationId: string) => {
      notificationStore.markAsRead(notificationId);
    };

    const markAllAsRead = () => {
      notificationStore.markAllAsRead();
    };

    const clearNotifications = () => {
      notificationStore.clearNotifications();
    };

    const handleLogout = async () => {
      try {
        await authStore.logout();
        showUserDropdown.value = false;
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const formatTime = (createdAt: string) => {
      const date = new Date(createdAt);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleClickOutside = (event: MouseEvent) => {
      const notification = document.querySelector('.notification');
      const userAvatar = document.querySelector('.user-avatar');
      if (
        notification &&
        !notification.contains(event.target as Node) &&
        userAvatar &&
        !userAvatar.contains(event.target as Node)
      ) {
        showNotificationDropdown.value = false;
        showUserDropdown.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      notificationStore,
      showNotificationDropdown,
      toggleNotificationDropdown,
      showUserDropdown,
      toggleUserDropdown,
      closeUserDropdown,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      handleLogout,
      formatTime,
      unreadNotifications: notificationStore.unreadNotifications,
      allNotifications: notificationStore.allNotifications,
    };
  },
  data() {
    return {
      menuItems: [
        { label: 'Home', path: '/' },
        { label: 'Leads', path: '/leads' },
        { label: 'Contacts', path: '/contacts' },
        { label: 'Accounts', path: '/accounts' },
        { label: 'Deals', path: '/deals' },
        { label: 'Tasks', path: '/tasks' },
        { label: 'Meetings', path: '/meetings' },
        { label: 'Calls', path: '/calls' },
        { label: 'Reports', path: '/reports' },
        { label: 'Campaigns', path: '/campaigns' },
        { label: 'Documents', path: '/documents' },
        { label: 'Visits', path: '/visits' },
        { label: 'Projects', path: '/projects' },
      ],
    };
  },
});
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a2526;
  padding: 10px 20px;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  margin: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  width: 30px;
  height: 30px;
}

.logo span {
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu {
  display: flex;
  gap: 20px;
}

.menu-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 10px;
  transition: color 0.3s;
}

.menu-item:hover {
  color: #3498db;
}

.menu-item.active {
  color: #3498db;
  font-weight: bold;
  border-bottom: 2px solid #3498db;
}

.upgrade-btn {
  background-color: transparent;
  border: 1px solid #3498db;
  color: #3498db;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.upgrade-btn:hover {
  background-color: #3498db;
  color: white;
}

.notification {
  position: relative;
  cursor: pointer;
}

.notification i {
  font-size: 24px;
  color: white;
}

.notification .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.notification-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  color: black;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.mark-all-read,
.clear-all {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}

.mark-all-read:hover,
.clear-all:hover {
  text-decoration: underline;
}

.no-notifications {
  padding: 10px;
  text-align: center;
  color: #666;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item.unread {
  background-color: #f0f8ff;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-message {
  font-size: 14px;
  color: #333;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.user-avatar {
  position: relative;
  cursor: pointer;
}

.user-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  color: black;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item i {
  font-size: 16px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
