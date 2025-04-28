<template>
  <div class="crm-input">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      @input="onInput"
      :class="inputClass"
      :type="type"
      :required="required"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  modelValue: any
  type?: string
  required?: boolean
  error?: string
  inputClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const id = computed(() => `input-${Math.random().toString(36).substring(2, 15)}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.crm-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.error-message {
  color: red;
  font-size: 12px;
}

</style>
