<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <h2 class="report-name">{{ report?.name }}</h2>
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
            <th>Industry</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in groupedData" :key="(account as Account).id">
            <td class="first-col">{{ (account as Account).name }}</td>
            <td>{{ (account as Account).phone }}</td>
            <td>{{ (account as Account).website }}</td>
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
            <th>Industry</th>
            <th>Account Name</th>
            <th>Phone</th>
            <th>Website</th>
            <th>City</th>
            <th>Country</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(accounts, industry) in groupedData" :key="industry">
            <tr v-for="account in accounts" :key="(account as Account).id">
              <td class="first-col">{{ industry }}</td>
              <td>{{ (account as Account).name }}</td>
              <td>{{ (account as Account).phone }}</td>
              <td>{{ (account as Account).website }}</td>
              <td>{{ (account as Account).city }}</td>
              <td>{{ (account as Account).country }}</td>
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
const reportData = ref<Account[] | Contact[]>([])
const isLoading = ref(true)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

const fetchReportData = async () => {
  try {
    isLoading.value = true

    switch (report.value?.id) {
      case 'contact-details':
        const resContacts = await contactRepository.show()
        reportData.value = resContacts.results || []
        break
      case 'key-accounts':
        const resKeyAccounts = await accountRepository.getKeyAccounts()
        reportData.value = resKeyAccounts.results || []
        break
      case 'accounts-by-industry':
        const resIndustry = await accountRepository.getAccountsByIndustry()
        reportData.value = resIndustry.results || []
        break
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

const groupedData = computed(() => {
  const data = reportData.value || []
  if (!data.length) return []

  switch (report.value?.id) {
    case 'accounts-by-industry':
      // Only pass Account[] to groupByIndustry
      return groupByIndustry(data.filter((item): item is Account => 'industry' in item))
    case 'key-accounts':
    case 'contact-details':
      return data
    default:
      return data
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

.currency {
  text-align: right;
  font-family: monospace;
}
</style>
