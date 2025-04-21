<template>
  <div class="form-group">
    <label v-if="type !== 'checkbox'">{{ label }}</label>

    <input
      v-if="type === 'text'"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
    <input
      v-if="type === 'email'"
      type="email"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
    <input
      v-if="type === 'tel'"
      type="tel"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
    <input
      v-if="type === 'url'"
      type="url"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
    <input
      v-if="type === 'number'"
      type="number"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onNumberInput"
    />

    <select v-if="type === 'select'" :value="modelValue" @change="onInput">
      <option value="">{{ defaultOption }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{ option.text }}
      </option>
    </select>

    <div v-if="type === 'checkbox'" class="checkbox-group">
      <label>
        <input type="checkbox" :checked="Boolean(modelValue)" @change="onCheckboxChange" />
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  label: String,
  placeholder: String,
  modelValue: [String, Number, Boolean] as PropType<string | number | boolean>,
  type: String,
  options: {
    type: Array as PropType<Array<{ value: string; text: string }>>,
    default: () => [],
  },
  defaultOption: String,
})

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement | null
  if (target) {
    emit('update:modelValue', target.value)
  }
}

function onNumberInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) {
    emit('update:modelValue', Number(target.value))
  }
}

function onCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) {
    emit('update:modelValue', target.checked)
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
