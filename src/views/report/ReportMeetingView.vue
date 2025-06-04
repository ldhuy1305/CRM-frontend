<template>
  <div class="report-container">
    <CRMLoading :loading="isLoading" />
    <div class="report-header">
      <h2 class="report-name">{{ report?.name }}</h2>
    </div>

    <!-- Planned Meetings This Month -->
    <template v-if="report?.category === 'meeting'">
      <!-- Summary Section -->
      <div class="summary-cards">
        <div class="summary-card">
          <h3>Meetings Overview</h3>
          <div class="summary-item">
            <span>Total Meetings:</span>
            <span>{{ reportData.length }}</span>
          </div>
          <div class="summary-item">
            <span>Online Meetings:</span>
            <span>{{ onlineMeetingsCount }}</span>
          </div>
          <div class="summary-item">
            <span>In-Person Meetings:</span>
            <span>{{ inPersonMeetingsCount }}</span>
          </div>
        </div>
      </div>
      <table v-if="report.id === 'planned-meetings'" class="report-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Host</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Type</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meeting in reportData" :key="meeting.id">
            <td class="first-col">{{ meeting.title }}</td>
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
      </table>
    </template>

    <!-- No Data Message -->
    <div v-if="!isLoading && (!reportData || reportData.length === 0)" class="no-data">
      No meetings planned for this month.
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { meetingRepository, userRepository } from '@/services'
import type { Meeting } from '@/types/meetings/meeting'
import type { UserInfo } from '@/types/users/user'
import { formatDateTime } from '@/utils/formatter'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import reportsData from './data/reports.json'

const route = useRoute()
const reportData = ref<Meeting[]>([])
const users = ref<UserInfo[]>([])
const isLoading = ref(true)
const toast = useToast()

const report = computed(() => {
  return reportsData.reports.find((r) => r.id === route.params.id)
})

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

const fetchReportData = async () => {
  try {
    isLoading.value = true
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const response = await meetingRepository.show({
      from_date: startOfMonth.toISOString(),
      to_date: endOfMonth.toISOString(),
    })

    reportData.value = response.results || []
  } catch (error) {
    console.error('Error fetching meeting data:', error)
    toast.error('Failed to load meeting data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

// Computed properties for summary calculations
const onlineMeetingsCount = computed(() => {
  return reportData.value.filter((meeting) => meeting.is_online_meeting).length
})

const inPersonMeetingsCount = computed(() => {
  return reportData.value.filter((meeting) => !meeting.is_online_meeting).length
})

onMounted(async () => {
  await Promise.all([fetchReportData(), fetchUsers()])
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
}

.attendees-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: none;
}

.attendees-list li {
  margin-bottom: 4px;
}

.summary-cards {
  color: #495057;
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

.host-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-badge {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.participants {
  position: relative;
}

.participants-tooltip {
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
}

.participants:hover .participants-tooltip {
  display: block;
}
</style>
