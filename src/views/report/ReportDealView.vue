<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <h2 class="report-name">{{ report?.name }}</h2>
    </div>

    <!-- Deal Reports -->
    <template v-if="report?.category === 'deal'">
      <!-- Open Deals -->
      <table v-if="report.id === 'open-deals' && Array.isArray(groupedData)" class="report-table">
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Amount</th>
            <th>Stage</th>
            <th>Close Date</th>
            <th>Account</th>
            <th>Contact</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deal in groupedData" :key="deal.id">
            <td class="first-col">{{ deal.name }}</td>
            <td class="currency">{{ formatVNDCurrency(deal.amount) }}</td>
            <td>{{ deal.stage?.name }}</td>
            <td>{{ formatDate(deal.close_date) }}</td>
            <td>{{ deal.account?.name }}</td>
            <td>
              {{ deal.contact ? `${deal.contact.last_name} ${deal.contact.first_name}` : '-' }}
            </td>
            <td>{{ `${deal.deal_owner?.first_name} ${deal.deal_owner?.last_name}` }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Lost Deals -->
      <table
        v-else-if="report.id === 'lost-deals' && Array.isArray(groupedData)"
        class="report-table"
      >
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Amount</th>
            <th>Lost Reason</th>
            <th>Close Date</th>
            <th>Account</th>
            <th>Contact</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deal in groupedData" :key="deal.id">
            <td class="first-col">{{ deal.name }}</td>
            <td class="currency">{{ formatVNDCurrency(deal.amount) }}</td>
            <td>{{ deal.lost_reason?.name }}</td>
            <td>{{ formatDate(deal.close_date) }}</td>
            <td>{{ deal.account?.name }}</td>
            <td>
              {{ deal.contact ? `${deal.contact.last_name} ${deal.contact.first_name}` : '-' }}
            </td>
            <td>{{ `${deal.deal_owner?.first_name} ${deal.deal_owner?.last_name}` }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Deals by Stage -->
      <table v-else-if="report.id === 'deals-by-stage'" class="report-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Deal Name</th>
            <th>Amount</th>
            <th>Close Date</th>
            <th>Account</th>
            <th>Contact</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(deals, stage) in groupedData" :key="stage">
            <tr v-for="deal in deals" :key="(deal as Deal).id">
              <td class="first-col">{{ stage }}</td>
              <td>{{ (deal as Deal).name }}</td>
              <td class="currency">{{ formatVNDCurrency((deal as Deal).amount) }}</td>
              <td>{{ formatDate((deal as Deal).close_date) }}</td>
              <td>{{ (deal as Deal).account?.name }}</td>
              <td>
                {{
                  (deal as Deal).contact
                    ? `${(deal as Deal).contact.last_name} ${(deal as Deal).contact.first_name}`
                    : '-'
                }}
              </td>
              <td>
                {{
                  `${(deal as Deal).deal_owner?.first_name} ${(deal as Deal).deal_owner?.last_name}`
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Deals Closing This Month -->
      <table
        v-else-if="report.id === 'deals-closing-month' && Array.isArray(groupedData)"
        class="report-table"
      >
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Amount</th>
            <th>Stage</th>
            <th>Close Date</th>
            <th>Account</th>
            <th>Contact</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deal in groupedData" :key="deal.id">
            <td class="first-col">{{ deal.name }}</td>
            <td class="currency">{{ formatVNDCurrency(deal.amount) }}</td>
            <td>{{ deal.stage?.name }}</td>
            <td>{{ formatDate(deal.close_date) }}</td>
            <td>{{ deal.account?.name }}</td>
            <td>
              {{ deal.contact ? `${deal.contact.last_name} ${deal.contact.first_name}` : '-' }}
            </td>
            <td>{{ `${deal.deal_owner?.first_name} ${deal.deal_owner?.last_name}` }}</td>
          </tr>
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
import { dealsRepository } from '@/services'
import type { Deal } from '@/types/deals/deal'
import { formatDate, formatVNDCurrency } from '@/utils/formatter'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import reportsData from './data/reports.json'

const route = useRoute()
const reportData = ref<Deal[]>([])
const isLoading = ref(true)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

const fetchReportData = async () => {
  try {
    isLoading.value = true

    switch (report.value?.id) {
      case 'open-deals': {
        const response = await dealsRepository.show()
        reportData.value = (response.results || []).filter(
          (deal) => deal.stage?.id !== 7 && deal.stage?.id !== 8,
        )
        break
      }
      case 'lost-deals': {
        const response = await dealsRepository.show()
        reportData.value = (response.results || []).filter((deal) => deal.stage?.id === 8)
        break
      }
      case 'deals-by-stage': {
        const resStage = await dealsRepository.show()
        reportData.value = resStage.results || []
        break
      }
      case 'deals-closing-month': {
        const response = await dealsRepository.show()
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()

        reportData.value = (response.results || []).filter((deal) => {
          if (!deal.close_date) return false

          const closeDate = new Date(deal.close_date)
          return (
            closeDate.getMonth() + 1 === currentMonth && closeDate.getFullYear() === currentYear
          )
        })
        break
      }
      default:
        reportData.value = []
    }
  } catch (error) {
    console.error('Error fetching report data:', error)
    toast.error('Failed to load report data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const groupByStage = (data: Deal[]) => {
  return data.reduce((groups: { [key: string]: Deal[] }, deal) => {
    const stage = deal.stage?.name || 'Unknown'
    if (!groups[stage]) {
      groups[stage] = []
    }
    groups[stage].push(deal)
    return groups
  }, {})
}

const groupedData = computed<Deal[] | Record<string, Deal[]>>(() => {
  const data = reportData.value || []
  if (!data.length) return []

  switch (report.value?.id) {
    case 'deals-by-stage':
      return groupByStage(data)
    case 'open-deals':
    case 'lost-deals':
    case 'deals-closing-month':
      return data
    default:
      return data
  }
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
  font-style: italic;
}

.currency {
  text-align: right;
  font-family: monospace;
}

.no-data {
  text-align: center;
  color: #6c757d;
  margin-top: 40px;
}

.report-table tr:hover {
  background-color: #f8f9fa;
}
</style>
