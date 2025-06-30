<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Account</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateAccount">Create Account</button>
        <!-- <button class="actions-btn">
            Actions
            <span class="dropdown-arrow">▼</span>
          </button> -->
      </div>
    </div>

    <AccountSearchForm @search="handleSearch" @clear="handleClear" />

    <div class="table-pagination">
      <div class="rows-per-page">
        Records per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <!-- <div class="pagination">
        <button class="nav-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          &lt;
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button
          class="nav-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage * rowsPerPage >= totalRecords"
        >
          &gt;
        </button>
      </div> -->
    </div>

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th @click="toggleSort('name')">
              <span>Account Name</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'name' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'name' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('phone')">
              <span>Phone</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'phone' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'phone' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('website')">
              <span>Website</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'website' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'website' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th>Account Owner</th>
          </tr>
        </thead>
        <tbody v-if="accounts.length !== 0">
          <tr v-for="account in accounts" :key="account.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(account.id)">⋮</button>
                  <div v-if="activeMoreOptions === account.id" class="options-dropdown">
                    <div @click="navigateToEditAccount(account.id)">Edit</div>
                    <div @click="deleteAccount(account.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>

            <td>
              <span @click="navigateToAccountDetails(account.id)">{{ account.name }}</span>
            </td>
            <td>{{ account.phone }}</td>
            <td>{{ account.website }}</td>
            <td>{{ account.account_owner?.last_name }} {{ account.account_owner?.first_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" style="text-align: center">No accounts found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { accountRepository } from '@/services'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AccountSearchForm from './AccountSearchForm.vue'

const router = useRouter()
const accounts = ref<Account[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)

const sortField = ref<string>('name')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')
const searchFilters = ref<Record<string, string>>({})
const isLoading = ref(false)

// Update the refs section with pagination support
const totalRecords = ref(0)
const currentPage = ref(1)

// Replace the fetchAccounts function with this improved version
const fetchAccounts = async () => {
  try {
    isLoading.value = true
    const payload: Record<string, any> = {
      limit: rowsPerPage.value,
      page: currentPage.value,
      ...searchFilters.value,
    }

    if (sortField.value) {
      payload.sort_field = sortField.value
      payload.sort_order = sortOrder.value
    }

    console.log('📤 Request payload:', payload)

    const res = await accountRepository.show(payload)
    accounts.value = res.results
    totalRecords.value = res.total
  } catch (error) {
    console.error('❌ Error fetching accounts:', error)
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
  fetchAccounts()
}

const handleSearch = async (filters: Record<string, string>) => {
  currentPage.value = 1
  searchFilters.value = filters
  await fetchAccounts()
}

const handleClear = async () => {
  searchFilters.value = {}
  currentPage.value = 1
  sortField.value = ''
  sortOrder.value = 'ASC'
  await fetchAccounts()
}

const navigateToCreateAccount = () => {
  router.push('/accounts/create')
}

const navigateToAccountDetails = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const navigateToEditAccount = (accountId: number) => {
  router.push(`/accounts/${accountId}/edit`)
}

const toggleMoreOptions = (accountId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === accountId ? null : accountId
}

const deleteAccount = async (accountId: number) => {
  if (!confirm('Confirm to delete this account?')) {
    return
  }

  try {
    await accountRepository.destroy(accountId)
    console.log('✅ Account deleted successfully:', accountId)
    await fetchAccounts()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting account:', error)
    alert('Failed to delete account. Please try again.')
  }
}

const changePage = (page: number) => {
  if (page < 1 || (page - 1) * rowsPerPage.value >= totalRecords.value) {
    return
  }
  currentPage.value = page
  fetchAccounts()
}

onMounted(() => {
  fetchAccounts()
})

watch(rowsPerPage, () => {
  fetchAccounts()
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
