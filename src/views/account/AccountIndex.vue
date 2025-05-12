<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Account</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateAccount()">Create Account</button>
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

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Account Name</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Account Owner</th>
          </tr>
        </thead>
        <tbody v-if="accounts.length != 0">
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
            <td colspan="6" style="text-align: center">No contacts found.</td>
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

const router = useRouter()
const accounts = ref<Account[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)
const isLoading = ref(false)

const fetchAccounts = async () => {
  try {
    isLoading.value = true
    const res = await accountRepository.show({ limit: rowsPerPage.value })
    console.log('📦 Fetched accounts:', res.results)
    accounts.value = res.results
  } catch (error) {
    console.error('❌ Error fetching leads:', error)
  } finally {
    isLoading.value = false
  }
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

const toggleMoreOptions = (contactId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === contactId ? null : contactId
}

const deleteAccount = async (accountId: number) => {
  if (!confirm('Confirm to delete this account?')) {
    return
  }

  try {
    await accountRepository.destroy(accountId)
    console.log('✅ Contact deleted successfully:', accountId)
    await fetchAccounts()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting account:', error)
    alert('Failed to delete contact. Please try again.')
  }
}

onMounted(() => {
  fetchAccounts()
})

watch(rowsPerPage, () => {
  fetchAccounts()
})
</script>
