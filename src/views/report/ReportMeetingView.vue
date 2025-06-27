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
          <tr v-for="meeting in groupedData" :key="meeting.id">
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
              <span class="online-badge" v-if="meeting.is_online_meeting"> Online </span>
              <span class="in-person-badge" v-if="!meeting.is_online_meeting"> In Person </span>
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
const isExporting = ref(false)
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

    const response = await meetingRepository.show()

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

    console.log('Export parameters:', Object.fromEntries(params))
    console.log('Export URL:', `/meetings/export-excel/?${params.toString()}`)

    // Call the meeting export API
    const response = await meetingRepository.exportExcel(params.toString())

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
  } catch (error: any) {
    console.error('Error exporting to Excel:', error)

    let errorMessage = 'Failed to export Excel file. Please try again.'

    if (error.response?.status === 406) {
      errorMessage = 'Export format not supported. Please contact support.'
    } else if (error.response?.status === 404) {
      errorMessage = 'Export endpoint not found. Please check the API configuration.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error occurred during export. Please try again later.'
    }

    toast.error(errorMessage, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isExporting.value = false
  }
}

// Helper function to download file
const downloadFile = (blob: Blob, filename: string) => {
  try {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw new Error('Failed to download file')
  }
}

// Computed properties for summary calculations
const onlineMeetingsCount = computed(() => {
  return reportData.value.filter((meeting) => meeting.is_online_meeting).length
})

const getMeetingThisMonth = (meeting: Meeting) => {
  const meetingDate = new Date(meeting.from_datetime)
  const currentDate = new Date()
  return (
    meetingDate.getMonth() === currentDate.getMonth() &&
    meetingDate.getFullYear() === currentDate.getFullYear()
  )
}

const groupedData = computed<Meeting[]>(() => {
  const data = reportData.value || []
  if (!data.length) return []

  if (report.value?.id === 'planned-meetings') {
    return data.filter(getMeetingThisMonth)
  }

  return data
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

.first-col {
  font-weight: 700;
  background-color: antiquewhite;
  font-style: italic;
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

.in-person-badge {
  background-color: #e3f2fd;
  color: #1976d2;
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
