<template>
  <div class="description-section">
    <h2>Description Information</h2>
    <div class="form-group">
      <textarea v-model="form.description" rows="6"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ form: any }>()
</script>

<style scoped>
.description-section {
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group textarea {
  padding: 10px;
  font-size: 1em;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}
</style>
