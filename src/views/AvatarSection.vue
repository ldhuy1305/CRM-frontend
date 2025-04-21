<template>
  <div class="avatar-section">
    <div class="avatar-placeholder">
      <img src="@/assets/default_avatar.png" alt="Lead Avatar" />
    </div>
    <span class="edit-avatar">Edit avatar</span>
  </div>
</template>

<script setup lang="ts">
defineProps()
</script>

<style scoped>
.avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ccc;
}

.avatar-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  color: #007bff;
  cursor: pointer;
  font-size: 0.9em;
}
</style>
