<template>
  <div class="crm-input">
    <label :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        @input="onInput"
        :type="computedType"
        :required="required"
        :disabled="disabled"
        :class="inputClass"
      />
      <span
        v-if="isPasswordType"
        class="toggle-password-icon"
        @click="togglePassword"
        role="button"
        tabindex="0"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @keydown.enter="togglePassword"
      >
        <font-awesome-icon v-if="showPassword" :icon="['fas', 'eye']" class="eye-icon" />
        <font-awesome-icon v-else :icon="['fas', 'eye-slash']" class="eye-icon" />
      </span>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: any
  type?: string
  required?: boolean
  disabled?: boolean
  error?: string
  inputClass?: string
  showPassword?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'toggle-password'): void
}>()

const id = computed(() => `input-${Math.random().toString(36).substring(2, 15)}`)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const isPasswordType = computed(() => props.type === 'password' || props.type === 'text')
const showPassword = computed(() => props.showPassword ?? false)

const computedType = computed(() =>
  props.type === 'password' && showPassword.value ? 'text' : props.type,
)

const togglePassword = () => {
  emit('toggle-password')
}
</script>

<style scoped>
.crm-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-size: 14px;
  color: #1a3353;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  height: 38px; /* Add fixed height */
}

/* For date input specific styling */
input[type='date'] {
  height: 38px;
  padding: 0.5rem;
}

.toggle-password-icon {
  position: absolute;
  right: 0.75rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px 10px;
}

.toggle-password-icon:focus {
  outline: 2px solid #2563eb;
  border-radius: 4px;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
