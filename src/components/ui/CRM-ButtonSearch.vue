<template>
  <div class="button-group">
    <CRMButton customClass="btn-clear" @click="onClear">Clear</CRMButton>
    <CRMButton customClass="btn-search" @click="onSearch">Search</CRMButton>
  </div>
</template>

<script setup lang="ts">
import CRMButton from './CRMButton.vue'

const emit = defineEmits(['clear', 'search'])

function onClear() {
  emit('clear')
}

function onSearch() {
  emit('search')
}
</script>


<style>
@import '/src/assets/main.css';

.button-group {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-clear {
  padding: 8px 16px;
  background: var(--btn);
  color: var(--btn-text-color);
  border-radius: var(--btn-border-radius);
  cursor: pointer;
}

.btn-search {
  padding: 8px 16px;
  border: none;
  color: var(--btn-text-color);
  background: var(--btn-search-bg);
  border-radius: var(--btn-border-radius);
  cursor: pointer;
}
</style>
