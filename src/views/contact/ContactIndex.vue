<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Contacts</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateContact">Create Contact</button>
        <!-- <button class="actions-btn">
            Actions
            <span class="dropdown-arrow">▼</span>
          </button> -->
      </div>
    </div>

    <ContactSearchForm @search="handleSearch" @clear="handleClear" />

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
            <!-- <th class="checkbox-column"></th> -->
            <th @click="toggleSort('last_name')">
              <!-- <input type="checkbox" />
                <span class="sort-icon">▼</span> -->
              <span>Contact Name</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'last_name' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'last_name' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('company_name')">
              <span>Company</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'company_name' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'company_name' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('email')">
              <span>Email</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'email' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'email' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('phone')">
              <span>Phone</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'phone' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'phone' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th>Contact Owner</th>
          </tr>
        </thead>
        <tbody v-if="contacts.length !== 0">
          <tr v-for="contact in contacts" :key="contact.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(contact.id)">⋮</button>
                  <div v-if="activeMoreOptions === contact.id" class="options-dropdown">
                    <div @click="navigateToEditContact(contact.id)">Edit</div>
                    <div>Send Email</div>
                    <div>Create Task</div>
                    <div @click="deleteContact(contact.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <td @click="navigateTocontactDetails(contact.id)">
              {{ contact.last_name }} {{ contact.first_name }}
            </td>
            <td>{{ contact.company }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.contact_owner?.last_name }} {{ contact.contact_owner?.first_name }}</td>

            <span v-if="contact.account" @click="navigateTocontactDetails(contact.account.id)">
              {{ getAccountName(contact.account.id) }}
            </span>
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
import { contactRepository, accountRepository } from '@/services'
import ContactSearchForm from './ContactSearchForm.vue'
import type { Contact } from '@/types/contacts/contact'
import type { Account } from '@/types/accounts/account'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/shared/index.css'

const router = useRouter()
const contacts = ref<Contact[]>([])
const accounts = ref<Account[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)

const sortField = ref<string>('')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')
const searchFilters = ref<Record<string, string>>({})
const isLoading = ref(false)

const fetchData = async () => {
  try {
    isLoading.value = true

    const payload = {
      limit: rowsPerPage.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      ...searchFilters.value,
    }

    console.log('Payload Contact:', payload)

    const [contactsRes, accountsRes] = await Promise.all([
      contactRepository.show(),
      accountRepository.show(),
    ])

    contacts.value = contactsRes.results
    accounts.value = accountsRes.results
    console.log('📦 Fetched contacts:', contactsRes.results)
    console.log('📦 Fetched accounts:', accountsRes.results)
  } catch (error) {
    console.error('❌ Error fetching contacts:', error)
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
  fetchData()
}

const handleSearch = async (filters: Record<string, string>) => {
  searchFilters.value = filters
  await fetchData()
}

const handleClear = async () => {
  searchFilters.value = {}
  await fetchData()
}

const navigateToCreateContact = () => {
  router.push('/contacts/create')
}

const navigateTocontactDetails = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const navigateToAccountDetails = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const navigateToEditContact = (contactId: number) => {
  router.push(`/contacts/${contactId}/edit`)
}

const toggleMoreOptions = (contactId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === contactId ? null : contactId
}

const deleteContact = async (contactId: number) => {
  if (!confirm('Confirm to delete this contact?')) {
    return
  }

  try {
    isLoading.value = true
    await contactRepository.destroy(contactId)
    console.log('✅ Contact deleted successfully:', contactId)
    await fetchData()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting contact:', error)
    alert('Failed to delete contact. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const getAccountName = (accountId: number): string => {
  const account = accounts.value.find((acc) => acc.id === accountId)
  return account?.name || ''
}

onMounted(() => {
  fetchData()
})

watch(rowsPerPage, () => {
  fetchData()
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
