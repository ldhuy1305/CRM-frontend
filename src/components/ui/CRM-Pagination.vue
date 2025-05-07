<template>
  <div class="pagination">
    <button class="nav-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
      &lt;
    </button>
    <span class="current-page">{{ currentPage }}</span>
    <button
      class="nav-btn"
      :disabled="currentPage === totalPages || totalRecords <= rowsPerPage"
      @click="goToPage(currentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  totalRecords: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'update:currentPage', page: number): void
}>()

const totalPages = ref(Math.ceil(props.totalRecords / props.rowsPerPage))

watch([() => props.totalRecords, () => props.rowsPerPage], () => {
  totalPages.value = Math.ceil(props.totalRecords / props.rowsPerPage)
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-btn {
  padding: 6px 12px;
  cursor: pointer;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

.nav-btn:disabled {
  background-color: #e9e9e9;
  cursor: not-allowed;
}

.current-page {
  margin: 0 10px;
}
</style>
