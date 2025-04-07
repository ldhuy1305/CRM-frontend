<template>
  <div id="app">
    <div v-if="isLoading" class="loading-overlay">Đang tải...</div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  setup() {
  },
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
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
