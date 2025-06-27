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

    <!-- Account & Contact Reports -->
    <template v-if="report?.category === 'account'">
      <!-- Key Accounts -->
      <table v-if="report.id === 'key-accounts'" class="report-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Phone</th>
            <th>Website</th>
            <th>City</th>
            <th>Country</th>
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in groupedData" :key="(account as Account).id">
            <td class="first-col">{{ (account as Account).name }}</td>
            <td>{{ (account as Account).phone }}</td>
            <td>{{ (account as Account).website }}</td>
            <td>{{ (account as Account).city }}</td>
            <td>{{ (account as Account).country }}</td>
            <td>{{ (account as Account).industry?.name }}</td>
            <td>
              {{
                `${(account as Account).account_owner?.first_name} ${(account as Account).account_owner?.last_name}`
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Accounts by Industry -->
      <table v-else-if="report.id === 'accounts-by-industry'" class="report-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Phone</th>
            <th>Website</th>
            <th>City</th>
            <th>Country</th>
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(accounts, industry) in groupedData" :key="industry">
            <tr v-for="account in accounts" :key="(account as Account).id">
              <td>{{ (account as Account).name }}</td>
              <td>{{ (account as Account).phone }}</td>
              <td>{{ (account as Account).website }}</td>
              <td>{{ (account as Account).city }}</td>
              <td>{{ (account as Account).country }}</td>
              <td class="first-col">{{ industry }}</td>
              <td>
                {{
                  `${(account as Account).account_owner?.first_name} ${(account as Account).account_owner?.last_name}`
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Contact Address Details -->
      <table v-else-if="report.id === 'contact-details'" class="report-table">
        <thead>
          <tr>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Account</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in groupedData" :key="(contact as Contact).id">
            <td class="first-col">
              {{ `${(contact as Contact).last_name} ${(contact as Contact).first_name}` }}
            </td>
            <td>{{ (contact as Contact).email }}</td>
            <td>{{ (contact as Contact).phone }}</td>
            <td>{{ (contact as Contact).street }}</td>
            <td>{{ (contact as Contact).city }}</td>
            <td>{{ (contact as Contact).state_province }}</td>
            <td>{{ (contact as Contact).postal_code }}</td>
            <td>{{ (contact as Contact).country }}</td>
            <td>{{ (contact as Contact).account }}</td>
            <td>
              {{
                `${(contact as Contact).contact_owner?.first_name} ${
                  (contact as Contact).contact_owner?.last_name
                }`
              }}
            </td>
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
import { accountRepository, contactRepository } from '@/services'
import type { Account } from '@/types/accounts/account'
import type { Contact } from '@/types/contacts/contact'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import reportsData from './data/reports.json'

const route = useRoute()
const reportAccountData = ref<Account[]>([])
const reportContactData = ref<Contact[]>([])
const isLoading = ref(true)
const isExporting = ref(false)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

const fetchReportData = async () => {
  try {
    isLoading.value = true
    const resContacts = await contactRepository.show()
    const resAccounts = await accountRepository.show()
    reportContactData.value = resContacts.results || []
    reportAccountData.value = resAccounts.results || []
  } catch (error) {
    console.error('Error fetching report data:', error)
    toast.error('Failed to load report data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

// Export to Excel function
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
      case 'key-accounts':
        break

      case 'accounts-by-industry':
        params.append('group_by', 'industry')
        break

      case 'contact-details':
        break
    }

    console.log('Export parameters:', Object.fromEntries(params))
    console.log('Export URL:', getExportUrl() + `?${params.toString()}`)

    // Call the appropriate export API based on report category
    let response: Blob

    if (report.value.category === 'account' && report.value.id !== 'contact-details') {
      // Use account export API
      response = await accountRepository.exportExcel(params.toString())
    } else {
      // Use contact export API
      response = await contactRepository.exportExcel(params.toString())
    }

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

// Helper function to get export URL based on report type
const getExportUrl = (): string => {
  if (report.value?.category === 'account' && report.value.id !== 'contact-details') {
    return '/accounts/export-excel/'
  } else {
    return '/contacts/export-excel/'
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
  const contactData = reportContactData.value || []
  const accountData = reportAccountData.value || []
  if (!contactData.length && !accountData.length) return []

  switch (report.value?.id) {
    case 'accounts-by-industry':
      return groupByIndustry(accountData)
    case 'key-accounts':
      return accountData
    case 'contact-details':
      return contactData
    default:
      return contactData
  }
})

const groupByIndustry = (data: Account[]) => {
  return data.reduce((groups: { [key: string]: Account[] }, account) => {
    const industry = account.industry?.name || 'Unknown'
    if (!groups[industry]) {
      groups[industry] = []
    }
    groups[industry].push(account)
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

.currency {
  text-align: right;
  font-family: monospace;
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
