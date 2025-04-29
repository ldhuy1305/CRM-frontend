<template>
  <div v-if="loading" class="loading-overlay">
    <VueSpinnerDots :size="40" :speed="0.9" color="#ff6500" />
  </div>
</template>

<script setup lang="ts">
import { VueSpinnerDots } from 'vue3-spinners'

defineProps<{
  loading: boolean
}>()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
