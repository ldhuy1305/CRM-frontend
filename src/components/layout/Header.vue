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
          :class="{ active: isActiveRoute(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>

    <div class="header-right">
      <div class="notification" @click="toggleNotifications">
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

    <NotificationsPanel v-if="showNotificationsPanel" @close="showNotificationsPanel = false" />
  </header>
</template>

<script lang="ts">
import NotificationsPanel from '@/components/ui/NotificationsPanel.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useNotificationStore } from '@/stores/modules/notifications'
import '@/styles/layout/header.css'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: 'Header',
  components: {
    NotificationsPanel,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    const currentPath = computed(() => route.path)
    const showDropdown = ref(false)
    const showNotificationsPanel = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const toggleNotifications = () => {
      showNotificationsPanel.value = !showNotificationsPanel.value
      if (showNotificationsPanel.value) {
        showDropdown.value = false
      }
    }

    const handleLogout = async () => {
      try {
        await authStore.logout(router)
        showDropdown.value = false
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const isActiveRoute = (path: string) => {
      if (path === '/leads') {
        return (
          route.path === '/leads' ||
          route.path === '/leads/create' ||
          route.path.match(/^\/leads\/\d+$/) || // /leads/{id}
          route.path.match(/^\/leads\/\d+\/convert$/) || // /leads/{id}/convert
          route.path.match(/^\/leads\/\d+\/edit$/) // /leads/{id}/edit
        )
      }
      return route.path === path
    }

    return {
      notificationStore,
      showNotificationsPanel,
      toggleNotifications,
      showDropdown,
      toggleDropdown,
      handleLogout,
      currentPath,
      isActiveRoute,
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
        { label: 'Campaigns', path: '/campaigns' },
        { label: 'Tasks', path: '/tasks' },
        { label: 'Meetings', path: '/meetings' },
        { label: 'Calls', path: '/calls' },
        { label: 'Reports', path: '/reports' },
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
