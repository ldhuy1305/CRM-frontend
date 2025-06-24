<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="details-header">
      <div class="module-profile">
        <button class="icon-button btn-back" @click="router.back()">
          <span class="arrow-left"></span>
        </button>
        <div class="module-title">
          <h1>{{ meeting?.title }}</h1>
          <div class="tag">
            <span>#{{ meeting?.id }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <div class="action-buttons">
          <button class="btn-secondary" @click="navigateToEditMeeting(meeting?.id)">Edit</button>
          <button class="btn-primary" @click="handleDelete(meeting?.id)">Delete</button>
        </div>
      </div>
    </div>

    <div class="meeting-content-section">
      <div class="meeting-summary-card">
        <div class="meeting-section-content">
          <div class="info-row">
            <div class="info-label">Host:</div>
            <div class="info-value">
              {{ meeting?.created_by?.first_name }} {{ meeting?.created_by?.last_name }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">From:</div>
            <div class="info-value">
              {{ formatDateTime(meeting?.from_datetime) }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">To:</div>
            <div class="info-value">
              {{ formatDateTime(meeting?.to_datetime) }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">Meeting Type:</div>
            <div class="info-value">
              <span class="online-badge" v-if="meeting.is_online_meeting"> Online </span>
              <span class="in-person-badge" v-if="!meeting.is_online_meeting"> In Person </span>
            </div>
          </div>
        </div>
      </div>

      <div class="meeting-details-section">
        <div class="meeting-section-header">
          <h3>Meeting Information</h3>
        </div>
        <div class="meeting-section-content">
          <div class="info-grid">
            <div class="info-row">
              <label class="info-label">Title</label>
              <div class="info-value">{{ meeting?.title }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Location</label>
              <div class="info-value">{{ meeting?.location || '—' }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">From</label>
              <div class="info-value">{{ formatDateTime(meeting?.from_datetime) }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">To</label>
              <div class="info-value">{{ formatDateTime(meeting?.to_datetime) }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Created By</label>
              <div class="info-value">
                {{ meeting?.created_by?.first_name }} {{ meeting?.created_by?.last_name }}
                <div class="timestamp">{{ formatDateTime(meeting?.created_at) }}</div>
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Modified By</label>
              <div class="info-value" v-if="meeting?.updated_by">
                {{ meeting?.updated_by?.first_name }} {{ meeting?.updated_by?.last_name }}
                <div class="timestamp">{{ formatDateTime(meeting?.updated_at) }}</div>
              </div>
              <div v-else></div>
            </div>
            <div class="info-row" v-if="meeting?.is_all_day">
              <label class="info-label">All Day</label>
              <div class="info-value">✓</div>
            </div>
            <div class="info-row" v-if="meeting?.is_online_meeting">
              <label class="info-label">Online Meeting</label>
              <div class="info-value">✓</div>
            </div>
          </div>
        </div>
      </div>

      <div class="meeting-right-sidebar">
        <div class="participants-section">
          <div class="meeting-participant-section-header">
            <h3>Participants ({{ meeting?.participants?.length || 0 }})</h3>
            <button
              class="btn-tertiary"
              @click="sendEmailToAll"
              :disabled="!hasValidParticipants"
              :title="
                hasValidParticipants
                  ? 'Send email to all participants'
                  : 'No participants with valid email addresses'
              "
            >
              <i class="fas fa-envelope"></i>
              Send Email To All
            </button>
          </div>
          <div class="participants-list">
            <div
              v-for="participant in meeting?.participants"
              :key="participant.email"
              class="participant-item"
            >
              <div class="participant-details">
                <div class="participant-name">{{ participant.name }}</div>
                <div class="participant-email">{{ participant.email }}</div>
              </div>
              <button
                class="btn-tertiary"
                @click="sendEmailToParticipant(participant)"
                :disabled="!participant.email"
                :title="
                  participant.email
                    ? `Send email to ${participant.email}`
                    : 'No email address available'
                "
              >
                <i class="fas fa-envelope"></i>
                Send Email
              </button>
            </div>
            <div v-if="!meeting?.participants?.length" class="no-participants">
              No participants added yet
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { meetingRepository } from '@/services'
import '@/styles/meeting/styles.css'
import '@/styles/shared/index.css'
import type { Meeting, Participant } from '@/types/meetings/meeting'
import { formatDateTime } from '@/utils/formatter'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = Number(route.params.id)
const meeting = ref<Meeting>({} as Meeting)
const isLoading = ref(false)

const fetchMeeting = async () => {
  try {
    isLoading.value = true
    const response = await meetingRepository.index(id)
    meeting.value = response.data || response
  } catch (error) {
    console.error('Error fetching meeting:', error)
    toast.error('Failed to load meeting details', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const userName = computed(() => {
  if (authStore.user) {
    return `${authStore?.user.user.first_name} ${authStore?.user.user.last_name}`.trim()
  }
  return 'Unibeam CRM Contacts'
})

const hasValidParticipants = computed(() => {
  return meeting.value.participants?.some((p) => p.email && p.email.trim() !== '') || false
})

const navigateToEditMeeting = (meetingId?: number) => {
  if (meetingId) {
    router.push(`/meetings/${meetingId}/edit`)
  }
}

const handleDelete = async (meetingId?: number) => {
  if (!meetingId || !confirm('Are you sure you want to delete this meeting?')) {
    return
  }

  try {
    isLoading.value = true
    await meetingRepository.destroy(meetingId)
    toast.success('Meeting deleted successfully', {
      position: POSITION.BOTTOM_RIGHT,
    })
    router.push('/meetings')
  } catch (error) {
    console.error('Error deleting meeting:', error)
    toast.error('Failed to delete meeting', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const formatMeetingTime = () => {
  const fromDate = new Date(meeting.value.from_datetime)
  const toDate = new Date(meeting.value.to_datetime)

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  const date = fromDate.toLocaleDateString('vi-VN', dateOptions)
  const fromTime = fromDate.toLocaleTimeString('vi-VN', timeOptions)
  const toTime = toDate.toLocaleTimeString('vi-VN', timeOptions)

  return `${date} from ${fromTime} to ${toTime}`
}

const sendEmailToParticipant = (participant: Participant) => {
  if (!participant.email) {
    toast.error('No email address available for this participant', {
      position: POSITION.BOTTOM_RIGHT,
    })
    return
  }
  const meetingTime = formatMeetingTime()
  const subject = encodeURIComponent(`[Unibeam CRM] Meeting Invitation: ${meeting.value.title}`)
  const body = encodeURIComponent(
    `Dear ${participant.name || 'there'},\n\nYou are invited to attend the following meeting:\n\n` +
      `Meeting Details:\n` +
      `• Title: ${meeting.value.title}\n` +
      `• Meeting ID: #${meeting.value.id}\n\n` +
      `• Date & Time: ${meetingTime}\n` +
      `• Location: ${meeting.value.location || (meeting.value.is_online_meeting ? 'Online Meeting' : 'TBD')}\n` +
      `• Meeting Type: ${meeting.value.is_online_meeting ? 'Online' : 'In Person'}\n` +
      `Please confirm your attendance and let me know if you have any questions.\n\n` +
      `Best regards,\n${userName.value} - Unibeam CRM`,
  )

  const mailtoLink = `mailto:${participant.email}?subject=${subject}&body=${body}`

  console.log('Individual email details:', {
    to: participant.email,
    participant: participant.name,
    currentUser: userName.value,
    mailtoLink,
  })

  window.location.href = mailtoLink
}

const sendEmailToAll = () => {
  const validParticipants =
    meeting.value.participants?.filter((p) => p.email && p.email.trim() !== '') || []

  if (validParticipants.length === 0) {
    toast.error('No participants with valid email addresses found', {
      position: POSITION.BOTTOM_RIGHT,
    })
    return
  }

  const meetingTime = formatMeetingTime()
  const participantNames = validParticipants.map((p) => p.name).join(', ')
  const emails = validParticipants.map((p) => p.email).join(',')

  const subject = encodeURIComponent(`[Unibeam CRM] Meeting Invitation: ${meeting.value.title}`)
  const body = encodeURIComponent(
    `Dear all,\n\nYou are all invited to attend the following meeting:\n\n` +
      `Meeting Details:\n` +
      `• Title: ${meeting.value.title}\n` +
      `• Meeting ID: #${meeting.value.id}\n` +
      `• Date & Time: ${meetingTime}\n` +
      `• Location: ${meeting.value.location || (meeting.value.is_online_meeting ? 'Online Meeting' : 'TBD')}\n` +
      `• Meeting Type: ${meeting.value.is_online_meeting ? 'Online' : 'In Person'}\n` +
      `• Participants: ${participantNames}\n\n` +
      `Please confirm your attendance and let me know if you have any questions.\n\n` +
      `Looking forward to seeing you all at the meeting.\n\n` +
      `Best regards,\n${userName.value} - Unibeam CRM`,
  )

  const mailtoLink = `mailto:${emails}?subject=${subject}&body=${body}`

  console.log('Bulk email details:', {
    to: emails,
    participantCount: validParticipants.length,
    participants: participantNames,
    currentUser: userName.value,
    mailtoLink,
  })

  window.location.href = mailtoLink
}

onMounted(() => {
  fetchMeeting()
})
</script>
