<template>
  <div class="page-container">
    <div class="leads-header">
      <h1>Leads</h1>
      <div class="header-actions">
        <button class="create-lead-btn" @click="navigateToCreateLead">Create Lead</button>
        <!-- <button class="actions-btn">
          Actions
          <span class="dropdown-arrow">▼</span>
        </button> -->
      </div>
    </div>

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

    <div class="leads-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <!-- <th class="checkbox-column"></th> -->
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
          <tr v-for="lead in leads" :key="lead.id" class="lead-row">
            <td>
              <div class="lead-name-cell">
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
            <td>{{ lead.lead_source?.name || 'N/A' }}</td>
            <td>{{ lead.lead_owner?.last_name }} {{ lead.lead_owner?.first_name }}</td>
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
import { leadRepository } from '@/services'
import '@/styles/lead/index.css'
import '@/styles/main.css'
import type { Lead } from '@/types/leads/lead'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const leads = ref<Lead[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)

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

const navigateToLeadDetails = (leadId: number) => {
  router.push(`/leads/${leadId}`)
}

const navigateToConvertLead = (leadId: number) => {
  router.push(`/leads/${leadId}/convert`)
}

const navigateToEditLead = (leadId: number) => {
  router.push(`/leads/${leadId}/edit`)
}

const toggleMoreOptions = (leadId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === leadId ? null : leadId
}

const deleteLead = async (leadId: number) => {
  if (!confirm('Confirm to delete this lead?')) {
    return
  }

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
