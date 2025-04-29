<template>
  <div id="app">
    <CRMLoading :loading="loadingStore.isLoading" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { useLoadingStore } from '@/stores/modules/loading'

const loadingStore = useLoadingStore()
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
