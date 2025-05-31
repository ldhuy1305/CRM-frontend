<template>
  <div class="page-container">
    <div class="reports-layout">
      <SideBar @category-selected="handleCategorySelect" />

      <div class="reports-content">
        <div class="reports-header">
          <h2>Reports</h2>
        </div>

        <table class="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filteredReports" :key="report.id">
              <td class="report-name">
                {{ report.name }}
              </td>
              <td class="report-description">{{ report.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import reportsData from '@/views/report/data/reports.json'
import { computed, ref } from 'vue'
import SideBar from './SideBar.vue'

const selectedCategory = ref('all')
const selectedReports = ref<string[]>([])
const selectAll = ref(false)

// Use the imported JSON data
const reports = reportsData.reports

const filteredReports = computed(() => {
  if (selectedCategory.value === 'all') {
    return reports
  }
  return reports.filter((report) => report.category === selectedCategory.value)
})

const handleCategorySelect = (category: string) => {
  selectedCategory.value = category
  selectedReports.value = []
  selectAll.value = false
}
</script>

<style scoped>
.reports-layout {
  display: flex;
  height: 100vh;
}

.reports-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.reports-header {
  margin-bottom: 20px;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reports-table th,
.reports-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.reports-table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.checkbox-column {
  width: 40px;
}

.report-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-icon {
  color: #6c757d;
}

.report-name {
  font-weight: 500;
  color: #777;
}

.report-description {
  font-style: italic;
}

tr:hover {
  background-color: #f8f9fa;
}

h2 {
  margin: 0;
  color: #343a40;
}
</style>
