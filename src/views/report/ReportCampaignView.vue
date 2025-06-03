<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <h2 class="report-name">{{ report?.name }}</h2>
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

.report-name {
  font-size: 24px;
  color: #6c757d;
  margin-bottom: 24px;
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
</style>
