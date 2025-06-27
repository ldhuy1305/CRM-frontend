<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <div class="report-title-section">
        <h2 class="report-name">{{ report?.name }}</h2>
        <p class="description">{{ report?.description }}</p>
      </div>
      <div class="report-actions">
        <button
          class="btn-export"
          @click="exportToExcel"
          :disabled="isLoading || !groupedData || groupedData.length === 0"
        >
          <i class="fas fa-file-excel"></i>
          Export Excel
        </button>
      </div>
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
          <template v-for="(leads, status) in groupedData" :key="status">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).email }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td class="first-col">{{ status }}</td>
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
          <template v-for="(leads, source) in groupedData" :key="source">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
              <td>{{ (lead as Lead).company_name }}</td>
              <td>{{ (lead as Lead).email }}</td>
              <td>{{ (lead as Lead).phone }}</td>
              <td>{{ (lead as Lead).street }}</td>
              <td>{{ (lead as Lead).city }}</td>
              <td>{{ (lead as Lead).state_province }}</td>
              <td>{{ (lead as Lead).postal_code }}</td>
              <td>{{ (lead as Lead).country }}</td>
              <td>{{ (lead as Lead).lead_status?.name }}</td>
              <td class="first-col">{{ source }}</td>
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
          <template v-for="(leads, owner) in groupedData" :key="owner">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
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
              <td class="first-col">{{ owner }}</td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Industry Based Reports -->
      <table v-else-if="report.id === 'leads-by-industry'" class="report-table">
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
          <template v-for="(leads, industry) in groupedData" :key="industry">
            <tr v-for="lead in leads" :key="(lead as Lead).id">
              <td>{{ `${(lead as Lead).last_name} ${(lead as Lead).first_name}` }}</td>
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
              <td class="first-col">{{ industry }}</td>
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
const isExporting = ref(false)
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

// Add the export function
const exportToExcel = async () => {
  if (!report.value || !groupedData.value || groupedData.value.length === 0) {
    toast.error('No data available to export', {
      position: POSITION.BOTTOM_RIGHT,
    })
    return
  }

  try {
    isExporting.value = true
    toast.info('Preparing Excel export...', {
      position: POSITION.BOTTOM_RIGHT,
    })

    // Create dynamic parameters based on the current report type
    const params = new URLSearchParams()

    // Always include the filename
    params.append('filename', report.value.id)

    // Add report-specific parameters based on the current report
    switch (report.value.id) {
      case 'leads-by-status':
        params.append('group_by', 'status')
        break

      case 'leads-by-source':
        params.append('group_by', 'source')
        break

      case 'leads-by-owner':
        params.append('group_by', 'owner')
        break

      case 'leads-by-industry':
        params.append('group_by', 'industry')
        break
      default:
    }
    console.log('Export parameters:', Object.fromEntries(params))
    console.log('Export URL:', `/leads/export-excel/?${params.toString()}`)

    // Call the export API
    const response = await leadRepository.exportExcel(params.toString())

    // Generate filename with report name and timestamp
    const timestamp = new Date().toISOString()
    const reportName = report.value.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    const filename = `${reportName}_${timestamp}.xlsx`

    // Handle the file download
    if (response instanceof Blob) {
      downloadFile(response, filename)
    } else if (response && typeof response === 'object' && 'url' in response) {
      // If the API returns a download URL
      window.open((response as any).url, '_blank')
    } else {
      throw new Error('Invalid response format')
    }

    toast.success('Excel file exported successfully!', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    toast.error('Failed to export Excel file. Please try again.', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isExporting.value = false
  }
}

// Helper function to download file
const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

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

const groupByStatus = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const status = lead.lead_status?.name || 'Unknown'
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(lead)
    return groups
  }, {})
}

const groupBySource = (data: Lead[]) => {
  return data.reduce((groups: { [key: string]: Lead[] }, lead) => {
    const source = lead.lead_source?.name || 'Unknown'
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
    const industry = lead.industry?.name || 'Unknown'
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

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
}

.report-title-section {
  flex: 1;
}

.report-name {
  font-size: 24px;
  color: #6c757d;
  margin-bottom: 24px;
}

.description {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.report-actions {
  display: flex;
  gap: 12px;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-export:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-export:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.btn-export i {
  font-size: 16px;
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
  background-color: antiquewhite;
}

.highlight-field {
  background-color: #007bff !important;
  color: white !important;
  font-weight: 700 !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .report-header {
    flex-direction: column;
    align-items: stretch;
  }

  .report-actions {
    justify-content: flex-end;
  }
}
</style>
