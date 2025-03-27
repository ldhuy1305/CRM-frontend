<!-- src/App.vue -->
<template>
  <div id="app">
    <div v-if="isLoading" class="loading-overlay">Đang tải...</div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore();

    const token = localStorage.getItem('token');
    if (token && !authStore.isAuthenticated) {
      authStore.isAuthenticated = true;
    }

    const isLoading = false;

    return {
      isAuthenticated: authStore.isAuthenticated,
      isLoading,
    };
  },
});
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
