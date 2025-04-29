<template>
  <div class="page-container">
    <div class="module-header">
      <h1>Leads</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateLead">Create Lead</button>
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
        <span class="current-page">{{ currentPage }}</span>
        <button class="nav-btn" >&gt;</button>
      </div>
    </div>

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Lead name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Lead Source</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody v-if="leads.length != 0">
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
            <td @click="navigateToLeadDetails(lead.id)">
              {{ lead.last_name }} {{ lead.first_name }}
            </td>
            <td>{{ lead.company_name }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.phone }}</td>
            <td>{{ lead.lead_source?.name || 'N/A' }}</td>
            <td>{{ lead.lead_owner?.last_name }} {{ lead.lead_owner?.first_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" style="text-align: center">No leads found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { leadRepository } from '@/services'
import LeadSearchForm from '@/views/lead/LeadSearchForm.vue'
import type { Lead } from '@/types/leads/lead'

const router = useRouter()
const leads = ref<Lead[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)
const searchFilters = ref<any>({})
const currentPage = ref(1)

const fetchLeads = async () => {
  try {
    const params = {
      limit: rowsPerPage.value,
      page: currentPage.value,
      ...searchFilters.value,
    }
    const res = await leadRepository.show(params)
    leads.value = res.results
  } catch (error) {
    console.error('❌ Error fetching leads:', error)
  }
}

const handleSearch = (filters: any) => {
  searchFilters.value = { ...filters }
  // currentPage.value = 1
  // fetchLeads()
}

const handleClear = () => {
  searchFilters.value = {}
  // currentPage.value = 1
  // fetchLeads()
}

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
    await fetchLeads()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting lead:', error)
    alert('Failed to delete lead. Please try again.')
  }
}


// const nextPage = () => {
//   currentPage.value++
//   fetchLeads()
// }

onMounted(() => {
  fetchLeads()
})

watch(rowsPerPage, () => {
  fetchLeads()
})
</script>

<style scoped></style>
