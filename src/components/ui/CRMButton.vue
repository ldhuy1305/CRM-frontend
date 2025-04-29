<template>
    <button :class="customClass" @click="emit('click')">
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    customClass?: string
  }>()
  
  const emit = defineEmits(['click'])
  </script>
  