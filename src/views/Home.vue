<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="welcome-header">
      <h2>
        Welcome <span class="user-name">{{ userName }}</span>
      </h2>
    </div>

    <div class="grid-layout">
      <!-- My Open Tasks -->
      <div class="table-section">
        <h3>My Open Tasks</h3>
        <table v-if="openTasks.length > 0">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Related To</th>
              <th>Contact Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in openTasks"
              :key="task.id"
              @click="navigateToTask(task.id)"
              class="clickable-row"
            >
              <td>{{ task.title }}</td>
              <td>{{ formatDate(task.due_date ?? undefined) }}</td>
              <td>{{ task.status.name }}</td>
              <td>{{ task.priority.name }}</td>
              <td>{{ task.related_account?.name || '' }}</td>
              <td>
                {{ task.contact ? `${task.contact.last_name} ${task.contact.first_name}` : '' }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-else>
          <p>No open tasks found.</p>
        </div>
      </div>

      <!-- My Meetings -->
      <div class="table-section">
        <h3>My Meetings</h3>
        <table v-if="meetings.length > 0">
          <thead>
            <tr>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Host</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="meeting in meetings"
              :key="meeting.id"
              @click="navigateToMeeting(meeting.id)"
              class="clickable-row"
            >
              <td>{{ meeting.title }}</td>
              <td>{{ formatDateTime(meeting.from_datetime) }}</td>
              <td>{{ formatDateTime(meeting.to_datetime) }}</td>
              <td>{{ getHostInfo(meeting.host) }}</td>
              <td>
                <span class="online-badge" v-if="meeting.is_online_meeting"> Online </span>
                <span class="in-person-badge" v-if="!meeting.is_online_meeting"> In Person </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-else>
          <p>No meetings found.</p>
        </div>
      </div>

      <!-- Today's Leads -->
      <div class="table-section">
        <h3>Today's Leads</h3>
        <table v-if="todayLeads.length > 0">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="lead in todayLeads"
              :key="lead.id"
              @click="navigateToLead(lead.id)"
              class="clickable-row"
            >
              <td>{{ `${lead.last_name} ${lead.first_name}` }}</td>
              <td>{{ lead.company_name }}</td>
              <td>{{ lead.email }}</td>
              <td>{{ lead.phone }}</td>
              <td>{{ lead.lead_source?.name }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-else>
          <p>No leads found today.</p>
        </div>
      </div>

      <!-- My Deals Closing This Month -->
      <div class="table-section">
        <h3>My Deals Closing This Month</h3>
        <table v-if="monthDeals.length > 0">
          <thead>
            <tr>
              <th>Deal Name</th>
              <th>Amount</th>

              <th>Closing Date</th>
              <th>Contact</th>
              <th>Account</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="deal in monthDeals"
              :key="deal.id"
              @click="navigateToDeal(deal.id)"
              class="clickable-row"
            >
              <td>{{ deal.name }}</td>
              <td>{{ formatVNDCurrency(deal.amount) }}</td>
              <td>{{ formatDate(deal.close_date) }}</td>
              <td>
                {{ deal.contact ? `${deal.contact.last_name} ${deal.contact.first_name}` : '' }}
              </td>
              <td>{{ deal.account?.name || '' }}</td>
              <td>{{ deal.stage?.name }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-else>
          <p>No deals closing this month.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import {
  dealsRepository,
  leadRepository,
  meetingRepository,
  taskRepository,
  userRepository,
} from '@/services'
import { useAuthStore } from '@/stores/modules/auth'
import '@/styles/home/style.css'
import type { Deal } from '@/types/deals/deal'
import type { Lead } from '@/types/leads/lead'
import type { Meeting } from '@/types/meetings/meeting'
import type { Task } from '@/types/task/task'
import type { UserInfo } from '@/types/users/user'
import { formatDate, formatDateTime, formatVNDCurrency } from '@/utils/formatter'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)

// Data refs
const openTasks = ref<Task[]>([])
const meetings = ref<Meeting[]>([])
const todayLeads = ref<Lead[]>([])
const monthDeals = ref<Deal[]>([])
const users = ref<UserInfo[]>([])

// Computed for user name
const userName = computed(() => {
  if (authStore.user) {
    return `${authStore?.user.user.first_name} ${authStore?.user.user.last_name}`.trim()
  }
  return 'Guest'
})

// Fetch functions
const fetchOpenTasks = async () => {
  try {
    const response = await taskRepository.show({
      status: 'open',
      assignee: authStore.user?.user.id,
    })
    openTasks.value = response.results || response
  } catch (error) {
    console.error('Error fetching open tasks:', error)
  }
}

const fetchMeetings = async () => {
  try {
    const response = await meetingRepository.show({
      host: authStore.user?.user.id,
      from_date: new Date().toISOString(),
    })
    meetings.value = response.results || response
    console.log('Meetings:', meetings.value)
  } catch (error) {
    console.error('Error fetching meetings:', error)
  }
}

const fetchTodayLeads = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await leadRepository.show({
      created_date: today,
      owner: authStore.user?.user.id,
    })
    todayLeads.value = response.results || response
  } catch (error) {
    console.error("Error fetching today's leads:", error)
  }
}

const fetchMonthDeals = async () => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const response = await dealsRepository.show({
      owner: authStore.user?.user.id,
    })

    monthDeals.value = (response.results || response).filter((deal) => {
      if (!deal.close_date) return false

      const closeDate = new Date(deal.close_date)
      return closeDate.getMonth() + 1 === currentMonth && closeDate.getFullYear() === currentYear
    })

    console.log('Month Deals:', monthDeals.value)
  } catch (error) {
    console.error('Error fetching deals:', error)
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

// Navigation functions
const navigateToTask = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
}

const navigateToMeeting = (meetingId: number) => {
  router.push(`/meetings/${meetingId}`)
}

const navigateToLead = (leadId: number) => {
  router.push(`/leads/${leadId}`)
}

const navigateToDeal = (dealId: number) => {
  router.push(`/deals/${dealId}`)
}

// Fetch all data on component mount
const fetchAllData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchOpenTasks(),
      fetchMeetings(),
      fetchTodayLeads(),
      fetchUsers(),
      fetchMonthDeals(),
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllData()
})
</script>
