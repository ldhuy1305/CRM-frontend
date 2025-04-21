<template>
  <div class="create-lead-header">
    <h1>Create Lead</h1>
    <div class="header-actions">
      <UiButton variant="cancel" @click="onCancel">Cancel</UiButton>
      <UiButton variant="danger">Create & New</UiButton>
      <UiButton>Create</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/UiButton.vue'

const emit = defineEmits(['cancel'])
const onCancel = () => emit('cancel')
</script>

<style scoped>
.create-lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>
