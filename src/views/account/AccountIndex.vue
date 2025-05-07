<template>
  <div class="page-container">
    <div class="module-header">
      <h1>Accounts</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateAccount">Create Account</button>
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
      <div class="pagination">
        <button class="nav-btn">&lt;</button>
        <span class="current-page">1</span>
        <button class="nav-btn">&gt;</button>
      </div>
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
                    <div>Send Email</div>
                    <div>Create Task</div>
                    <div @click="deleteAccount(account.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <td @click="navigateToAccountDetails(account.id)">
              {{ account.name }}
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
import { accountRepository } from '@/services'
import AccountSearchForm from './AccountSearchForm.vue'
import type { Account } from '@/types/accounts/account'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const accounts = ref<Account[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)

const sortField = ref<string>('name')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')
const searchFilters = ref<Record<string, string>>({})

const fetchAccounts = async () => {
  try {
    const payload = {
      limit: rowsPerPage.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      ...searchFilters.value,
    }

    console.log('Payload Account:', payload)

    const res = await accountRepository.show(payload)
    accounts.value = res.results
  } catch (error) {
    console.error('❌ Error fetching accounts:', error)
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
  searchFilters.value = filters
  await fetchAccounts()
}

const handleClear = async () => {
  searchFilters.value = {}
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
