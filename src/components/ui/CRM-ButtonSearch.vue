<template>
  <div class="button-group">
    <button class="btn-clear" @click="onClear">Clear</button>
    <button class="btn-search" @click="onSearch">Search</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, defineEmits } from 'vue'

export default defineComponent({
  name: 'CRMButtonSearch',
  emits: ['clear', 'search'],
  setup(_, { emit }) {
    function onClear() {
      emit('clear')
    }

    function onSearch() {
      emit('search')
    }

    return {
      onClear,
      onSearch,
    }
  },
})
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
