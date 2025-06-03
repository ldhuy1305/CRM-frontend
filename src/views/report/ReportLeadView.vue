<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <h2 class="report-name">{{ report?.name }}</h2>
    </div>

    <!-- Lead Reports -->
    <template v-if="report?.category === 'lead'">
      <!-- Today's Lead Reports -->
      <table v-if="report.id === 'todays-lead'" class="report-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Status</th>
            <th>Source</th>
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in groupedData" :key="(lead as Lead).id">
            <td class="first-col">
              {{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}
            </td>
            <td>{{ (lead as Lead).company_name }}</td>
            <td>{{ (lead as Lead).email }}</td>
            <td>{{ (lead as Lead).phone }}</td>
            <td>{{ (lead as Lead).street }}</td>
            <td>{{ (lead as Lead).city }}</td>
            <td>{{ (lead as Lead).state_province }}</td>
            <td>{{ (lead as Lead).postal_code }}</td>
            <td>{{ (lead as Lead).country }}</td>
            <td>{{ (lead as Lead).lead_status?.name }}</td>
            <td>{{ (lead as Lead).lead_source?.name }}</td>
            <td>{{ (lead as Lead).industry?.name }}</td>
            <td>
              {{
                `${(lead as Lead).lead_owner?.first_name} ${(lead as Lead).lead_owner?.last_name}`
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Status Based Reports -->
      <table v-else-if="report.id === 'leads-by-status'" class="report-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Source</th>
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(leads, status) in groupedData" :key="status">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td class="first-col">{{ status }}</td>
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td>{{ (lead as Lead).lead_source?.name }}</td>
              <td>{{ (lead as Lead).industry?.name }}</td>
              <td>
                {{
                  `${(lead as Lead).lead_owner?.first_name} ${(lead as Lead).lead_owner?.last_name}`
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Source Based Reports -->
      <table v-else-if="report.id === 'leads-by-source'" class="report-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Status</th>
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(leads, source) in groupedData" :key="source">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td class="first-col">{{ source }}</td>
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td>{{ (lead as Lead).lead_status?.name }}</td>
              <td>{{ (lead as Lead).industry?.name }}</td>
              <td>
                {{
                  `${(lead as Lead).lead_owner?.first_name} ${(lead as Lead).lead_owner?.last_name}`
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Owner Based Reports -->
      <table v-else-if="report.id === 'leads-by-owner'" class="report-table">
        <thead>
          <tr>
            <th>Owner</th>
            <th>Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Status</th>
            <th>Industry</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(leads, owner) in groupedData" :key="owner">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td class="first-col">{{ owner }}</td>
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td>{{ (lead as Lead).lead_status?.name }}</td>
              <td>{{ (lead as Lead).industry?.name }}</td>
              <td>{{ (lead as Lead).lead_source?.name }}</td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Industry Based Reports -->
      <table v-else-if="report.id === 'leads-by-industry'" class="report-table">
        <thead>
          <tr>
            <th>Industry</th>
            <th>Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Status</th>
            <th>Source</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(leads, industry) in groupedData" :key="industry">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td class="first-col">{{ industry }}</td>
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td>{{ (lead as Lead).lead_status?.name }}</td>
              <td>{{ (lead as Lead).lead_source?.name }}</td>
              <td>
                {{
                  `${(lead as Lead).lead_owner?.first_name} ${(lead as Lead).lead_owner?.last_name}`
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>

    <!-- No Data Message -->
    <div v-if="!isLoading && (!groupedData || groupedData.length === 0)" class="no-data">
      No data available for this report.
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { leadRepository } from '@/services'
import type { Lead } from '@/types/leads/lead'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import reportsData from './data/reports.json'

const route = useRoute()
const reportData = ref<Lead[]>([])
const isLoading = ref(true)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

const fetchReportData = async () => {
  try {
    isLoading.value = true
    const resLead = await leadRepository.show()
    reportData.value = resLead.results || []
  } catch (error) {
    console.error('Error fetching report data:', error)
    toast.error('Failed to load report data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

// Update the groupedData computed property
const groupedData = computed(() => {
  const data = reportData.value || []
  if (!data.length) return []

  switch (report.value?.id) {
    case 'leads-by-status':
      return groupByStatus(data)
    case 'leads-by-source':
      return groupBySource(data)
    case 'leads-by-owner':
      return groupByOwner(data)
    case 'leads-by-industry':
      return groupByIndustry(data)
    case 'todays-lead':
    case 'converted-leads':
      return data
    default:
      return data
  }
})

// Update the grouping functions to handle possible undefined values
const groupByStatus = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const status = lead.lead_status?.name || ''
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(lead)
    return groups
  }, {})
}

const groupBySource = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const source = lead.lead_source?.name || ''
    if (!groups[source]) {
      groups[source] = []
    }
    groups[source].push(lead)
    return groups
  }, {})
}

const groupByOwner = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const owner = lead.lead_owner
      ? `${lead.lead_owner.first_name} ${lead.lead_owner.last_name}`
      : 'Unknown'
    if (!groups[owner]) {
      groups[owner] = []
    }
    groups[owner].push(lead)
    return groups
  }, {})
}

const groupByIndustry = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const industry = lead.industry?.name || ''
    if (!groups[industry]) {
      groups[industry] = []
    }
    groups[industry].push(lead)
    return groups
  }, {})
}

onMounted(() => {
  fetchReportData()
})
</script>

<style scoped>
.report-container {
  padding: 20px;
}

.report-name {
  font-size: 24px;
  color: #6c757d;
  margin-bottom: 24px;
}

.description {
  color: #6c757d;
  margin-top: 8px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.report-table th,
.report-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.report-table th {
  background-color: white;
  font-weight: 600;
  color: #000;
}

.report-table td {
  color: #495057;
}

.report-table tr:hover {
  background-color: #f8f9fa;
}

.no-data {
  text-align: center;
  color: #6c757d;
  margin-top: 40px;
}

.first-col {
  font-weight: 700;
  font-style: italic;
}
</style>
