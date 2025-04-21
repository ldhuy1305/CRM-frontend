<template>
  <div class="leads-header">
    <h1>Leads</h1>
    <div class="header-actions">
      <UiButton variant="primary" @click="$emit('create')">Create Lead</UiButton>
      <UiButton variant="danger">
        Actions
        <span class="dropdown-arrow">▼</span>
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'


export default defineComponent({
  name: 'LeadsHeader',
  components: {
    UiButton,
  },
  emits: ['create'],
})
</script>

<style scoped>
.leads-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.dropdown-arrow {
  margin-left: 4px;
}
</style>
