<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="details-header">
      <div class="module-profile">
        <button class="icon-button btn-back" @click="router.back()">
          <span class="arrow-left"></span>
        </button>
        <div class="module-title">
          <div
            class="pointer-clickable"
            v-if="call?.contact"
            @click="navigateToContact(call.contact.id)"
          >
            <h1>
              <fas-icon icon="fas fa-phone-volume"></fas-icon> &nbsp;
              {{ call.contact.last_name }}
              {{ call.contact.first_name }}
            </h1>
          </div>
          <div class="tag">
            <span>#{{ call?.id }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <div class="action-buttons">
          <button class="btn-secondary" @click="navigateToEditCall(call?.id)">Edit</button>
          <button class="btn-primary" @click="handleDelete(call?.id)">Delete</button>
        </div>
      </div>
    </div>

    <div class="call-content-section">
      <!-- Summary Card -->
      <div class="call-summary-card">
        <div class="call-section-content">
          <div class="info-row">
            <div class="info-label">Call for:</div>
            <div
              class="info-value clickable"
              v-if="call?.contact"
              @click="navigateToContact(call.contact.id)"
            >
              {{ call.contact.last_name }} {{ call.contact.first_name }}
            </div>
            <div v-else>—</div>
          </div>

          <div class="info-row">
            <div class="info-label">Related to:</div>
            <div
              class="info-value clickable"
              v-if="call?.related_account"
              @click="navigateToAccount(call.related_account.id)"
            >
              {{ call.related_account.name }}
            </div>
            <div v-else>—</div>
          </div>

          <div class="info-row">
            <div class="info-label">Call Type:</div>
            <div class="info-value">{{ call?.call_type?.name }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">Call Start Time:</div>
            <div class="info-value">{{ formatDateTime(call?.start_time) }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">Duration:</div>
            <div class="info-value">{{ formatSecondsToMinutes(call?.duration) }} minutes</div>
          </div>

          <div class="info-row">
            <div class="info-label">Call Owner:</div>
            <div class="info-value">
              {{ call?.call_owner?.last_name }} {{ call?.call_owner?.first_name }}
            </div>
          </div>

          <div class="info-row">
            <label class="info-label">Created By</label>
            <div class="info-value">
              {{ call?.created_by?.last_name }} {{ call?.created_by?.first_name }}
              <div class="timestamp">{{ formatDateTime(call?.created_at) }}</div>
            </div>
          </div>
          <div class="info-row">
            <label class="info-label">Modified By</label>
            <div class="info-value" v-if="call?.updated_by">
              {{ call?.updated_by?.last_name }} {{ call?.updated_by?.first_name }}
              <div class="timestamp">{{ formatDateTime(call?.updated_at) }}</div>
            </div>
            <div v-else>—</div>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="call-details-section">
        <div class="call-section-header">
          <h3>Call Information</h3>
        </div>
        <div class="call-section-content">
          <h4>Purpose of Outgoing Call</h4>
          <div class="info-grid-1">
            <div class="info-row">
              <div class="info-label">Call Purpose</div>
              <div class="info-value">{{ call?.call_purpose?.name }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Call Agenda</div>
              <div class="info-value">{{ call?.call_agenda || '-' }}</div>
            </div>
          </div>

          <h4>Outcome of Outgoing Call</h4>
          <div class="info-grid-1">
            <div class="info-row">
              <div class="info-label">Call Result</div>
              <div class="info-value">{{ call?.call_result?.name }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ call?.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Voice Recording Section -->
      <div class="voice-recording-section">
        <div class="call-section-header">
          <h3>Voice Recording</h3>
        </div>
        <div class="call-section-content">
          <div class="voice-player" v-if="call?.voice_recording">
            <audio controls>
              <source :src="call.voice_recording" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div v-else>No recording available</div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="call-right-sidebar">
        <div class="contact-info" v-if="call?.contact">
          <div class="call-contact-header">
            <h3>{{ call.contact.last_name }} {{ call.contact.first_name }}</h3>
            <button class="btn-tertiary">Send Email</button>
          </div>
          <div class="call-contact-details">
            <div v-if="call.contact.phone" class="detail-item">
              <fas-icon icon="fas fa-phone"></fas-icon>
              {{ call.contact.phone }}
            </div>
            <div v-if="call.contact.email" class="detail-item">
              <fas-icon icon="fas fa-envelope"></fas-icon>
              {{ call.contact.email }}
            </div>
          </div>
        </div>

        <div class="related-items">
          <h3>Deal Summary</h3>
          <div v-if="call?.related_deal" class="deal-info">
            <div class="deal-name">{{ call.related_deal.name }}</div>
            <div class="deal-amount">{{ formatVNDCurrency(call.related_deal.amount) }}</div>
          </div>
          <div v-else>No Deals found</div>
        </div>

        <div class="activities">
          <h3>Open Activities</h3>
          <div class="activity-section">
            <div class="activity-type">
              Tasks <span>{{ openTasksCount }}</span>
            </div>
            <div class="activity-type">
              Meetings <span>{{ openMeetingsCount }}</span>
            </div>
            <div class="activity-type">
              Calls <span>{{ openCallsCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { callRepository } from '@/services'
import '@/styles/calls/styles.css'
import '@/styles/shared/index.css'
import type { Call } from '@/types/calls/call'
import { formatDateTime, formatSecondsToMinutes, formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const call = ref<Call>({} as Call)
const isLoading = ref(false)
const toast = useToast()
const openTasksCount = ref(0)
const openMeetingsCount = ref(0)
const openCallsCount = ref(0)

const fetchCall = async () => {
  try {
    isLoading.value = true
    const response = await callRepository.index(id)
    call.value = response.data || response
  } catch (error) {
    console.error('Error fetching call:', error)
    toast.error('Failed to load call details', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const navigateToEditCall = (callId: number) => {
  router.push(`/calls/${callId}/edit`)
}

const navigateToContact = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const navigateToAccount = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const handleDelete = async (callId: number) => {
  if (!confirm('Confirm to delete this Call?')) {
    return
  }
  try {
    isLoading.value = true
    await callRepository.destroy(callId)
    toast.success('Call deleted successfully', {
      position: POSITION.BOTTOM_RIGHT,
    })
    router.push('/calls')
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
  fetchCall()
})
</script>
