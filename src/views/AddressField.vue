<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input type="text" :value="modelValue" @input="handleInput" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input) {
    emit('update:modelValue', input.value)
  }
}
</script>

<style scoped>
/* .address-section {
  margin-bottom: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
} */
</style>
