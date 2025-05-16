<template>
  <div class="info-item">
    <label class="info-label">{{ label }}</label>

    <div class="info-value">
      <span v-if="!isEditing">{{ modelValue }}</span>

      <div v-if="isEditing" class="edit-container">
        <CRMInput
          v-model="inputValue"
          :class="{ invalid: isInvalid }"
          :placeholder="`Enter new ${label.toLowerCase()}`"
        />
        <div v-if="isInvalid" class="error-message">
          <span class="asterisk">*</span>
          <span class="error-text">This field is required.</span>
        </div>
      </div>
    </div>

    <div class="info-actions">
      <span
        v-if="!isEditing"
        class="edit-btn"
        @click="requestEdit"
        role="button"
        tabindex="0"
      >
        Edit
      </span>

      <div v-if="isEditing" class="action-buttons">
        <CRMButton class="save" @click="save">Save</CRMButton>
        <CRMButton class="cancel" @click="cancel">Cancel</CRMButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import CRMButton from '../ui/CRMButton.vue'
import CRMInput from '../ui/CRM-Input.vue'

const modelValue = defineModel<string>()

const props = defineProps<{
  label: string
  field: string
}>()

const isEditing = ref(false)
const inputValue = ref('')
const isInvalid = ref(false)

watch(
  () => modelValue.value,
  (newVal) => {
    inputValue.value = newVal || ''
  },
  { immediate: true },
)

const onOtherEdit = (e: Event) => {
  const detail = (e as CustomEvent).detail
  if (isEditing.value && detail !== props.field) {
    if (inputValue.value.trim() === '') {
      isInvalid.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('edit-field', onOtherEdit)
})

onBeforeUnmount(() => {
  window.removeEventListener('edit-field', onOtherEdit)
})

const requestEdit = () => {
  const event = new CustomEvent('edit-field', { detail: props.field })
  window.dispatchEvent(event)
  isEditing.value = true
  inputValue.value = modelValue.value || ''
  isInvalid.value = false
}

const save = () => {
  if (inputValue.value.trim() === '') {
    isInvalid.value = true
    return
  }
  modelValue.value = inputValue.value
  isEditing.value = false
  isInvalid.value = false
}

const cancel = () => {
  isEditing.value = false
  inputValue.value = modelValue.value || ''
  isInvalid.value = false
}
</script>

<style scoped>
.info-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #d1d5db;
}

.info-label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.info-value input {
  width: 100%;
}

.edit-btn {
  color: #0281ff;
  cursor: pointer;
}

.info-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

button.save {
  background: #1d8cf8;
  color: white;
}

button.cancel {
  background: #e5e7eb;
  color: #374151;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.asterisk {
  margin-right: 4px;
}
</style>
