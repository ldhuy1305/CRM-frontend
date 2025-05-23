<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Meetings</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateMeeting">Create Meeting</button>
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
            <th @click="toggleSort('title')">
              <span>Title</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'title' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'title' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('location')">
              <span>Location</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'location' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'location' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('host')">
              <span>Host</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'location' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'location' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('from_datetime')">
              <span>Start Time</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'from_datetime' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'from_datetime' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('to_datetime')">
              <span>End Time</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'to_datetime' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'to_datetime' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th>Type</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody v-if="meetings.length !== 0">
          <tr v-for="meeting in meetings" :key="meeting.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(meeting.id)">⋮</button>
                  <div v-if="activeMoreOptions === meeting.id" class="options-dropdown">
                    <div @click="navigateToEditMeeting(meeting.id)">Edit</div>
                    <div>Send Email</div>
                    <div @click="deleteMeeting(meeting.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <td @click="navigateToMeetingDetails(meeting.id)">{{ meeting.title }}</td>
            <td>{{ meeting.location }}</td>
            <td>
              <div class="host-info">
                {{ getHostInfo(meeting.host) }}
              </div>
            </td>
            <td>{{ formatDateTime(meeting.from_datetime) }}</td>
            <td>{{ formatDateTime(meeting.to_datetime) }}</td>
            <td>
              <span :class="{ 'online-badge': meeting.is_online_meeting }">
                {{ meeting.is_online_meeting ? 'Online' : 'In Person' }}
              </span>
            </td>
            <td>
              <div class="participants">
                {{ meeting.participants.length }} participant(s)
                <div class="participants-tooltip">
                  <div v-for="participant in meeting.participants" :key="participant.email">
                    {{ participant.name }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" style="text-align: center">No meetings found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { meetingRepository, userRepository } from '@/services'

import '@/styles/meeting/styles.css'
import '@/styles/shared/index.css'
import type { Meeting } from '@/types/meetings/meeting'
import type { UserInfo } from '@/types/users/user'
import { formatDateTime } from '@/utils/formatter'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const meetings = ref<Meeting[]>([])
const users = ref<UserInfo[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)
const isLoading = ref(false)

const sortField = ref<string>('')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')

const fetchMeetings = async () => {
  try {
    isLoading.value = true
    const payload = {
      limit: rowsPerPage.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
    }

    const response = await meetingRepository.show(payload)
    meetings.value = response.results
  } catch (error) {
    console.error('Error fetching meetings:', error)
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
  fetchMeetings()
}

const navigateToCreateMeeting = () => {
  router.push('/meetings/create')
}

const navigateToMeetingDetails = (meetingId: number) => {
  router.push(`/meetings/${meetingId}`)
}

const navigateToEditMeeting = (meetingId: number) => {
  router.push(`/meetings/${meetingId}/edit`)
}

const toggleMoreOptions = (meetingId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === meetingId ? null : meetingId
}

const deleteMeeting = async (meetingId: number) => {
  if (!confirm('Are you sure you want to delete this meeting?')) {
    return
  }

  try {
    isLoading.value = true
    await meetingRepository.destroy(meetingId)
    await fetchMeetings()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('Error deleting meeting:', error)
    alert('Failed to delete meeting. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const response = await userRepository.show()
    users.value = Array.isArray(response) ? response : response.results
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const getHostInfo = (hostId: number) => {
  const host = users.value.find((user) => user.id === hostId)
  if (host) {
    return `${host.first_name} ${host.last_name}`.trim() || 'Unknown'
  }
  return 'Unknown'
}

onMounted(async () => {
  await Promise.all([fetchMeetings(), fetchUsers()])
})

watch(rowsPerPage, () => {
  fetchMeetings()
})
</script>
