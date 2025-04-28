<template>
    <div>
      <label>{{ label }}</label>
      <input type="date" :value="modelValue" @input="updateValue" class="date-picker" />
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    label: string
    modelValue: string
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  function updateValue(event: Event) {
    const input = event.target as HTMLInputElement
    emit('update:modelValue', input.value)
  }
  </script>
  
  <style scoped>
  .date-picker {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  