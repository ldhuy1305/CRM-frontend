<template>
  <div class="table-footer">
    <div class="rows-per-page">
      Rows per page:
      <select v-model="rowsPerPageLocal" @change="changeRowsPerPage">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <div class="pagination">
      <button class="nav-btn" @click="goToPage(1)" :disabled="currentPageLocal === 1">«</button>
      <button class="nav-btn" @click="prevPage" :disabled="currentPageLocal === 1">‹</button>

      <span v-for="(page, index) in visiblePagesWithDots" :key="index">
        <span v-if="page === '...'" class="dots">...</span>
        <span
          v-else
          class="page-number"
          :class="{ active: currentPageLocal === page }"
          @click="goToPage(Number(page))"
        >
          {{ page }}
        </span>
      </span>

      <button class="nav-btn" @click="nextPage" :disabled="currentPageLocal === totalPages">
        ›
      </button>
      <button
        class="nav-btn"
        @click="goToPage(totalPages)"
        :disabled="currentPageLocal === totalPages"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  rowsPerPage: number
}>()

const emit = defineEmits(['update:currentPage', 'update:rowsPerPage'])

const currentPageLocal = ref(props.currentPage)
const rowsPerPageLocal = ref(props.rowsPerPage)

watch(
  () => props.currentPage,
  (val) => (currentPageLocal.value = val),
)

const changeRowsPerPage = () => {
  emit('update:rowsPerPage', Number(rowsPerPageLocal.value))
}

const prevPage = () => {
  if (currentPageLocal.value > 1) {
    currentPageLocal.value--
    emit('update:currentPage', currentPageLocal.value)
  }
}

const nextPage = () => {
  if (currentPageLocal.value < props.totalPages) {
    currentPageLocal.value++
    emit('update:currentPage', currentPageLocal.value)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPageLocal.value = page
    emit('update:currentPage', currentPageLocal.value)
  }
}

const visiblePagesWithDots = computed(() => {
  const total = props.totalPages
  const current = currentPageLocal.value
  const delta = 1;

  const range: (number | string)[] = []

  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)

  if (left > 2) {
    range.push('...')
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  if (right < total - 1) {
    range.push('...')
  }

  if (total > 1) {
    range.push(total)
  }

  return range
})
</script>

<style scoped>
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rows-per-page select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-number {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background-color: #1a3353;
  color: white;
}

.dots {
  padding: 4px 8px;
  color: #aaa;
}
</style>
