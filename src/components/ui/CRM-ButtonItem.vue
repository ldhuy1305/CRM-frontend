<template>
  <div class="actions">
    <CRMButton class="save" @click="$emit('save')">Save</CRMButton>
    <CRMButton class="cancel" @click="$emit('cancel')">Cancel</CRMButton>
    <CRMButton class="change" @click="$emit('change')">Change Password</CRMButton>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import CRMButton from './CRMButton.vue'

defineEmits(['save', 'cancel', 'change'])
</script>

<style scoped>
.actions {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.save {
  background: #1d8cf8;
  color: white;
}

button.cancel {
  background: #e5e7eb;
  color: #374151;
}
</style>
