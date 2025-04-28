<!-- <template>
  <div class="select-container">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="handleChange">
      <option v-for="option in options" :key="getValue?.(option)" :value="getValue?.(option)">
        {{ getLabel?.(option) }} 
      </option>
    </select>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  modelValue: [String, Number, null],
  options: Array,
  getLabel: Function,  
  getValue: Function,  
  error: String,
})

const emit = defineEmits(['update:modelValue'])

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

select:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style> -->

<template>
  <div class="select-wrapper">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="handleChange">
      <option v-for="option in options" :key="getOptionValue(option)" :value="getOptionValue(option)">
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  label: string
  modelValue: string | number
  options: Array<Record<string, any>>
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])


function getOptionLabel(option: any) {
  return option.label ?? option.name ?? option.value ?? 'N/A'
}


function getOptionValue(option: any) {
  return option.value ?? option.id ?? option.name
}


function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.select-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

select {
  padding: 8px;
  font-size: 16px;
  width: 100%;
  border-radius: 6px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
