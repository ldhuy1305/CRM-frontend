<template>
  <header class="app-header">
    <div class="logo">
      <img src="@/assets/unibeam-logo.png" alt="UNIBEAM Logo" />
      <!-- <span>UNIBEAM</span> -->

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
    </div>

    <div class="header-right">
      <div class="notification" @click="showNotifications">
        <i class="fas fa-bell"></i>
        <span v-if="unreadNotifications > 0" class="badge">{{ unreadNotifications }}</span>
      </div>

      <div class="user-avatar" @click="toggleDropdown">
        <img src="@/assets/default_avatar.png" alt="User Avatar" />
        <div v-if="showDropdown" class="dropdown">
          <router-link to="/profile" class="dropdown-item">Profile</router-link>
          <router-link to="/settings" class="dropdown-item">Settings</router-link>
          <div class="dropdown-item" @click="handleLogout">Logout</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import { useNotificationStore } from '@/stores/modules/notifications'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()

    const showDropdown = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const showNotifications = () => {
      console.log('Show notifications')
    }
    const handleLogout = async () => {
      try {
        await authStore.logout()
        showDropdown.value = false
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    return {
      notificationStore,
      showNotifications,
      showDropdown,
      toggleDropdown,
      handleLogout,
    }
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
      ],
    }
  },
  computed: {
    unreadNotifications(): number {
      return this.notificationStore.unreadNotifications
    },
  },
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0b192c;
  padding: 10px 20px;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo img {
  width: 100px;
  height: 25px;
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
  color: #ff6500;
}

.menu-item.active {
  color: #ff6500;
  font-weight: bold;
  border-bottom: 2px solid #ff6500;
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

.user-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
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
  display: block;
  color: #333;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
