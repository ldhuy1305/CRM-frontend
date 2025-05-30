<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Calls</h1>
      <div class="header-actions">
        <CreateCallDropdown @select-option="handleCreateOption" />
      </div>
    </div>

    <CallSearchForm @search="handleSearch" @clear="handleClear" />

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
            <th @click="toggleSort('subject')">
              <span>Title</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'subject' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'subject' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('related_to')">
              <span>Call Type</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'related_to' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'related_to' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('start_time')">
              <span>Start Time</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'start_time' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'start_time' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('duration')">
              <span>Call Duration</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'duration' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'duration' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('related_account')">
              <span>Related to</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'related_account' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'related_account' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>

            <th @click="toggleSort('contact')">
              <span>Contact</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'contact' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'contact' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('call_owner')">
              <span>Call Owner</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'call_owner' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'call_owner' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="calls.length !== 0">
          <tr v-for="call in calls" :key="call.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(call.id)">⋮</button>
                  <div v-if="activeMoreOptions === call.id" class="options-dropdown">
                    <div @click="navigateToEditCall(call.id)">Edit</div>
                    <div>Create Task</div>
                    <div @click="deleteCall(call.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <td @click="navigateToCallDetails(call.id)">{{ call.title }}</td>
            <td @click="navigateToCallDetails(call.id)">{{ call.call_type.name }}</td>
            <td @click="navigateToCallDetails(call.id)">{{ formatDateTime(call.start_time) }}</td>
            <td @click="navigateToCallDetails(call.id)" v-if="call.duration > 0">
              {{ formatSecondsToMinutes(call.duration) }}
            </td>
            <td @click="navigateToCallDetails(call.id)" v-else></td>
            <td
              v-if="call.related_account?.id"
              @click="navigateToRelatedAccount(call.related_account.id)"
            >
              {{ call.related_account.name }}
            </td>

            <td v-if="call.contact?.id" @click="navigateToContact(call.contact.id)">
              {{ call.contact?.last_name }} {{ call.contact?.first_name }}
            </td>
            <td v-else>{{ call.contact?.last_name }} {{ call.contact?.first_name }}</td>

            <td>{{ call.call_owner?.last_name }} {{ call.call_owner?.first_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" style="text-align: center">No calls found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateCallDropdown from '@/components/dropdowns/CreateCallDropdown.vue'
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { callRepository } from '@/services'
import '@/styles/shared/index.css'
import type { Call } from '@/types/calls/call'
import { formatDateTime, formatSecondsToMinutes } from '@/utils/formatter'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const calls = ref<Call[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)
const isLoading = ref(false)

const sortField = ref<string>('')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')
const searchFilters = ref<Record<string, string>>({})

const fetchCalls = async () => {
  try {
    isLoading.value = true
    const payload = {
      limit: rowsPerPage.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      ...searchFilters.value,
    }

    console.log('Payload Call:', payload)

    const response = await callRepository.show(payload)
    calls.value = response.results
    console.log('Fetched Calls:', calls.value)
  } catch (error) {
    console.error('Error fetching calls:', error)
    toast.error('Failed to fetch calls', {
      position: POSITION.BOTTOM_RIGHT,
    })
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
  fetchCalls()
}

const handleSearch = async (filters: Record<string, string>) => {
  searchFilters.value = filters
  await fetchCalls()
}

const handleClear = async () => {
  searchFilters.value = {}
  await fetchCalls()
}

const handleCreateOption = (option: 'schedule' | 'log') => {
  if (option === 'schedule') {
    router.push('/calls/create?type=schedule')
  } else {
    router.push('/calls/create?type=log')
  }
}

const navigateToCallDetails = (callId: number) => {
  router.push(`/calls/${callId}`)
}

const navigateToEditCall = (callId: number) => {
  router.push(`/calls/${callId}/edit`)
}

const navigateToContact = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const navigateToRelatedAccount = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const toggleMoreOptions = (callId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === callId ? null : callId
}

const deleteCall = async (callId: number) => {
  if (!confirm('Are you sure you want to delete this call?')) {
    return
  }

  try {
    isLoading.value = true
    await callRepository.destroy(callId)
    toast.success('Call deleted successfully', {
      position: POSITION.BOTTOM_RIGHT,
    })
    await fetchCalls()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('Error deleting call:', error)
    toast.error('Failed to delete call', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCalls()
})

watch(rowsPerPage, () => {
  fetchCalls()
})
</script>
