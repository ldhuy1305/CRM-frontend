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
      <div class="summary-card">
        <div class="section-content">
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
              <span :class="{ 'online-badge': meeting?.is_online_meeting }">
                {{ meeting?.is_online_meeting ? 'Online Meeting' : 'In Person Meeting' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h3>Meeting Information</h3>
        </div>
        <div class="section-content">
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
              <label class="info-label">All Day</label>
              <div class="info-value">{{ meeting?.is_all_day ? '✓' : '' }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Online Meeting</label>
              <div class="info-value">{{ meeting?.is_online_meeting ? '✓' : '' }}</div>
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
          </div>
        </div>
      </div>

      <div class="right-sidebar">
        <div class="participants-section">
          <div class="section-header">
            <h3>Participants ({{ meeting?.participants?.length || 0 }})</h3>
            <button class="btn-secondary">Add</button>
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
              <button class="btn-tertiary">Send Email</button>
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
import type { Meeting } from '@/types/meetings/meeting'
import { formatDateTime } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

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

onMounted(() => {
  fetchMeeting()
})
</script>
