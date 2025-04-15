<template>
  <div class="leads-container">
    <div class="leads-header">
      <h1>Leads</h1>
      <div class="header-actions">
        <button class="create-lead-btn" @click="navigateToCreateLead">Create Lead</button>
        <button class="actions-btn">
          Actions
          <span class="dropdown-arrow">▼</span>
        </button>
      </div>
    </div>

    <div class="leads-table">
      <table>
        <thead>
          <tr>
            <!-- <th class="checkbox-column"> -->
            <th>
              <!-- <input type="checkbox" />
              <span class="sort-icon">▼</span> -->
              <span>Lead name</span>
            </th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Lead Source</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody v-if="leads.length != 0">
          <tr v-for="lead in leads" :key="lead.id">
            <!-- <td class="checkbox-column"> -->
            <td>
              <!-- <input type="checkbox" /> -->
              <span>{{ lead.first_name }} {{ lead.last_name }}</span>
            </td>
            <td>{{ lead.company_name }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.phone }}</td>
            <td>{{ lead.lead_source?.name || 'N/A' }}</td>
            <td>{{ lead.lead_owner?.first_name }} {{ lead.lead_owner?.last_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" style="text-align: center">No leads found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="rows-per-page">
        Row per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="pagination">
        <button class="nav-btn">&lt;</button>
        <span class="current-page">1</span>
        <button class="nav-btn">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { leadRepository } from '@/services'
import type { Lead } from '@/types/leads/lead'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Lead',
  setup() {
    const router = useRouter()
    const leads = ref<Lead[]>([])
    const rowsPerPage = ref(10)

    const fetchLeads = async () => {
      try {
        const res = await leadRepository.show({ limit: rowsPerPage.value })
        console.log('✅ API Response:', res)
        console.log('📦 Fetched leads:', res.results)
        leads.value = res.results
      } catch (error) {
        console.error('❌ Error fetching leads:', error)
      }
    }

    const navigateToCreateLead = () => {
      router.push('/leads/create')
    }

    onMounted(() => {
      fetchLeads()
    })

    watch(rowsPerPage, () => {
      fetchLeads()
    })

    return {
      leads,
      rowsPerPage,
      navigateToCreateLead,
    }
  },
})
</script>

<style scoped>
.leads-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

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

.create-lead-btn {
  background-color: #1a3353;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.actions-btn {
  background-color: #ff4d00;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.leads-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fc;
  font-weight: 500;
  color: #1a3353;
}

.checkbox-column {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  color: #666;
  font-size: 12px;
}

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
  gap: 8px;
}

.nav-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.current-page {
  background-color: #1a3353;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
