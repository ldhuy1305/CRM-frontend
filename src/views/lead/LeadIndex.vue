<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Leads</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateLead">Create Lead</button>
        <!-- <button class="actions-btn">
            Actions
          <span class="dropdown-arrow">▼</span>
        </button> -->
      </div>
    </div>

    <LeadSearchForm @search="handleSearch" @clear="handleClear" />

    <div class="table-pagination">
      <div class="rows-per-page">
        Records per page:
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

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <!-- <th class="checkbox-column"></th> -->
            <th @click="toggleSort('last_name')">
              <!-- <input type="checkbox" />
              <span class="sort-icon">▼</span> -->
              <span>Lead name</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'last_name' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'last_name' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('company_name')">
              <span>Company</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'company_name' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'company_name' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('email')">
              <span>Email</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'email' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'email' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('phone')">
              <span>Phone</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'phone' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'phone' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th>Lead Source</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody v-if="leads.length !== 0">
          <tr v-for="lead in leads" :key="lead.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(lead.id)">⋮</button>
                  <div v-if="activeMoreOptions === lead.id" class="options-dropdown">
                    <div @click="navigateToEditLead(lead.id)">Edit</div>
                    <div>Send Email</div>
                    <div>Create Task</div>
                    <div @click="deleteLead(lead.id)">Delete</div>
                    <div @click="navigateToConvertLead(lead.id)">Convert</div>
                  </div>
                </div>
              </div>
            </td>
            <!-- <td class="checkbox-column"> -->
            <td>
              <!-- <input type="checkbox" /> -->
              <span @click="navigateToLeadDetails(lead.id)"
                >{{ lead.last_name }} {{ lead.first_name }}</span
              >
            </td>
            <td>{{ lead.company_name }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.phone }}</td>
            <td>{{ lead.lead_source.name }}</td>
            <td>{{ lead.lead_owner.first_name }} {{ lead.lead_owner.last_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" style="text-align: center">No leads found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { leadRepository } from '@/services'
import '@/styles/shared/index.css'
import type { Lead } from '@/types/leads/lead'
import LeadSearchForm from '@/views/lead/LeadSearchForm.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const leads = ref<Lead[]>([])
const rowsPerPage = ref(10)
const searchFilters = ref({})
const activeMoreOptions = ref<number | null>(null)

const sortField = ref<string>('')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')

const totalRecords = ref(0)
const currentPage = ref(1)
const isLoading = ref(false)

const fetchLeads = async () => {
  try {
    isLoading.value = true
    const payload: Record<string, any> = {
      limit: rowsPerPage.value,
      page: currentPage.value,
      ...searchFilters.value,
    }

    if (sortField.value) {
      payload.sort_Field = sortField.value
      payload.sort_Order = sortOrder.value
    }

    console.log('📤 Request payload:', payload)

    const res = await leadRepository.show(payload)
    leads.value = res.results
    totalRecords.value = res.total
  } catch (error) {
    console.error('❌ Error fetching leads:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortField.value = field
    sortOrder.value = 'ASC'
  }
  fetchLeads()
}

const handleSearch = async (filters: Record<string, string>) => {
  currentPage.value = 1
  searchFilters.value = filters
  await fetchLeads()
}

const handleClear = async () => {
  searchFilters.value = {}
  currentPage.value = 1
  sortField.value = ''
  sortOrder.value = 'ASC'
  await fetchLeads()
}

watch(rowsPerPage, () => {
  currentPage.value = 1
  fetchLeads()
})

const navigateToCreateLead = () => {
  router.push('/leads/create')
}
const navigateToLeadDetails = (leadId: number) => {
  router.push(`/leads/${leadId}`)
}
const navigateToEditLead = (leadId: number) => {
  router.push(`/leads/${leadId}/edit`)
}
const navigateToConvertLead = (leadId: number) => {
  router.push(`/leads/${leadId}/convert`)
}

const toggleMoreOptions = (leadId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === leadId ? null : leadId
}
const deleteLead = async (leadId: number) => {
  if (!confirm('Confirm to delete this lead?')) return
  try {
    await leadRepository.destroy(leadId)
    console.log('✅ Lead deleted successfully:', leadId)
    await fetchLeads()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting lead:', error)
    alert('Failed to delete lead. Please try again.')
  }
}

onMounted(() => {
  fetchLeads()
})

watch(rowsPerPage, () => {
  fetchLeads()
})
</script>

<style scoped>
thead {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #333;
}

thead th {
  padding: 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

thead th:hover {
  background-color: #f1f1f1;
}

.sort-icons {
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  user-select: none;
}

.sort-icons span {
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-bottom: -7px;
}

.sort-icons span.active {
  font-weight: bold;
  color: #333;
}

.sort-icons span:hover {
  color: #000;
}

.sort-icons span:active {
  color: #007bff;
}

.sort-icons span.active {
  color: #007bff;
}
</style>
