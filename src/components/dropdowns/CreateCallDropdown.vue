<template>
  <div class="create-call-dropdown">
    <button class="btn-primary" @click="toggleDropdown">Create Call</button>
    <div v-if="isOpen" class="dropdown-menu">
      <div class="dropdown-item" @click="selectOption('schedule')">Schedule a call</div>
      <div class="dropdown-item" @click="selectOption('log')">Log a call</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const emit = defineEmits(['select-option'])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: 'schedule' | 'log') => {
  emit('select-option', option)
  isOpen.value = false
}
</script>

<style scoped>
.create-call-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 160px;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>