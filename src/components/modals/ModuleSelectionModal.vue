<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <div class="header-actions">
          <button v-if="showNewButton" class="btn-primary" @click="handleNew">
            New {{ moduleName }}
          </button>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
      </div>

      <div class="modal-subheader">
        {{ subTitle }}
      </div>

      <div class="table-controls">
        <div class="records-info">Total Records: {{ totalRecords }}</div>
        <div class="pagination-control">
          {{ startRecord }}-{{ endRecord }} of {{ totalRecords }}
          <select v-model="rowsPerPage">
            <option value="10">10 Records Per Page</option>
            <option value="20">20 Records Per Page</option>
            <option value="50">50 Records Per Page</option>
          </select>
        </div>
      </div>

      <table class="modal-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
            <td v-for="column in columns" :key="column.key">
              {{ formatValue(item, column) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">Cancel</button>
        <button class="btn-primary" @click="handleSubmit">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Column {
  key: string
  label: string
  format?: (value: any) => string
}

interface Props {
  isOpen: boolean
  title: string
  subTitle?: string
  moduleName: string
  columns: Column[]
  items: any[]
  showNewButton?: boolean
  campaignId: number
}

const props = withDefaults(defineProps<Props>(), {
  subTitle: '',
  showNewButton: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', selectedIds: number[]): void
  (e: 'new'): void
}>()

const selectedItems = ref<number[]>([])
const selectAll = ref(false)
const rowsPerPage = ref(10)
const currentPage = ref(1)
const totalRecords = ref(0)

const startRecord = ref(1)
const endRecord = ref(10)

watch(
  () => props.items,
  (newItems) => {
    totalRecords.value = newItems.length
    updateRecordRange()
  },
)

const updateRecordRange = () => {
  startRecord.value = (currentPage.value - 1) * rowsPerPage.value + 1
  endRecord.value = Math.min(startRecord.value + rowsPerPage.value - 1, totalRecords.value)
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = props.items.map((item) => item.id)
  } else {
    selectedItems.value = []
  }
}

const formatValue = (item: any, column: Column) => {
  if (column.format) {
    return column.format(item[column.key], item)
  }

  // Handle nested object paths
  const value = item[column.key]
  return value !== undefined ? value : '-'
}

const closeModal = () => {
  emit('close')
  selectedItems.value = []
  selectAll.value = false
}

const handleSubmit = () => {
  emit('submit', selectedItems.value)
  closeModal()
}

const handleNew = () => {
  emit('new')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-subheader {
  color: #666;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.leads-table th,
.leads-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
