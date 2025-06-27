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
          :disabled="isLoading || !reportData || reportData.length === 0"
          :title="
            reportData && reportData.length > 0 ? 'Export report to Excel' : 'No data to export'
          "
        >
          <i class="fas fa-file-excel"></i>
          Export Excel
        </button>
      </div>
    </div>

    <!-- Campaign Revenue Report -->
    <template v-if="report?.id === 'campaign-revenue'">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <h3>Campaign Overview</h3>
          <div class="summary-item">
            <span>Total Campaigns:</span>
            <span>{{ reportData.length }}</span>
          </div>
          <div class="summary-item">
            <span>Active Campaigns:</span>
            <span>{{ activeCampaigns }}</span>
          </div>
          <div class="summary-item">
            <span>ROI:</span>
            <span>{{ calculateROI }}%</span>
          </div>
        </div>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Expected Revenue</th>
            <th>Actual Revenue</th>
            <th>Status</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in reportData" :key="campaign.id">
            <td class="first-col">{{ campaign.name }}</td>
            <td>{{ campaign.campaign_type?.name }}</td>
            <td>{{ formatDate(campaign.start_date ?? undefined) }}</td>
            <td>{{ formatDate(campaign.end_date ?? undefined) }}</td>
            <td class="currency">{{ formatVNDCurrency(Number(campaign.expected_revenue)) }}</td>
            <td class="currency">{{ formatVNDCurrency(Number(campaign.actual_cost)) }}</td>
            <td>{{ campaign.campaign_status?.name }}</td>
            <td>
              {{ `${campaign.campaign_owner?.first_name} ${campaign.campaign_owner?.last_name}` }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-right">Total:</td>
            <td class="currency">
              <strong>{{ formatVNDCurrency(totalExpectedRevenue) }}</strong>
            </td>
            <td class="currency">
              <strong>{{ formatVNDCurrency(totalActualRevenue) }}</strong>
            </td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </template>

    <!-- No Data Message -->
    <div v-if="!isLoading && (!reportData || reportData.length === 0)" class="no-data">
      No data available for this report.
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { campaignRepository } from '@/services'
import type { Campaign } from '@/types/campaigns/campaign'
import { formatDate, formatVNDCurrency } from '@/utils/formatter'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import reportsData from './data/reports.json'

const route = useRoute()
const reportData = ref<Campaign[]>([])
const isLoading = ref(true)
const isExporting = ref(false)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

const fetchReportData = async () => {
  try {
    isLoading.value = true
    const response = await campaignRepository.show()
    reportData.value = response.results || []
  } catch (error) {
    console.error('Error fetching campaign data:', error)
    toast.error('Failed to load campaign data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

// Export to Excel function
const exportToExcel = async () => {
  if (!report.value || !reportData.value || reportData.value.length === 0) {
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

    console.log('Export parameters:', Object.fromEntries(params))
    console.log('Export URL:', `/campaigns/export-excel/?${params.toString()}`)

    // Call the campaign export API
    const response = await campaignRepository.exportExcel(params.toString())

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
  } catch (error: any) {
    console.error('Error exporting to Excel:', error)

    let errorMessage = 'Failed to export Excel file. Please try again.'

    if (error.response?.status === 406) {
      errorMessage = 'Export format not supported. Please contact support.'
    } else if (error.response?.status === 404) {
      errorMessage = 'Export endpoint not found. Please check the API configuration.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error occurred during export. Please try again later.'
    }

    toast.error(errorMessage, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isExporting.value = false
  }
}

// Helper function to download file
const downloadFile = (blob: Blob, filename: string) => {
  try {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw new Error('Failed to download file')
  }
}

// Computed properties for summary calculations
const totalExpectedRevenue = computed(() => {
  return reportData.value.reduce((sum, campaign) => sum + Number(campaign.expected_revenue || 0), 0)
})

const totalActualRevenue = computed(() => {
  return reportData.value.reduce((sum, campaign) => sum + Number(campaign.actual_cost || 0), 0)
})

const activeCampaigns = computed(() => {
  return reportData.value.filter(
    (campaign) => campaign.campaign_status?.id === 1 || campaign.campaign_status?.id === 2,
  ).length
})

const calculateROI = computed(() => {
  if (totalExpectedRevenue.value === 0) return 0
  return (
    ((totalActualRevenue.value - totalExpectedRevenue.value) / totalExpectedRevenue.value) *
    100
  ).toFixed(2)
})

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
  margin-bottom: 8px;
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

.first-col {
  font-weight: 700;
  background-color: antiquewhite;
  font-style: italic;
}

.currency {
  text-align: right;
  font-family: monospace;
}

.text-right {
  text-align: right;
  font-weight: 600;
}

.summary-cards {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 16px 0;
  color: #495057;
}

.summary-item {
  display: flex;
  color: #495057;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #dee2e6;
}

.summary-item:last-child {
  border-bottom: none;
}

.no-data {
  text-align: center;
  color: #6c757d;
  margin-top: 40px;
}

.report-table tr:hover {
  background-color: #f8f9fa;
}

.report-table tfoot tr:hover {
  background-color: #fff1e5;
}

tfoot {
  background-color: #fff1e5;
  font-weight: 700;
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
