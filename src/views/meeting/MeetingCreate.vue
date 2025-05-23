<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Create Meeting</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Meeting Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Title<span class="mandatory">*</span></label>
            <input
              type="text"
              v-model="form.title"
              :class="{ 'input-error': errors.title }"
              placeholder="Enter meeting title"
            />
            <span class="error-message">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" v-model="form.location" placeholder="Enter location" />
          </div>

          <div class="form-group">
            <label>Host<span class="mandatory">*</span></label>
            <select v-model="form.host" :class="{ 'input-error': errors.host }">
              <option value="">Select Host</option>
              <option v-for="owner in meetingHosts" :key="owner.id" :value="owner.id">
                {{ owner.first_name }} {{ owner.last_name }}
              </option>
            </select>
            <span class="error-message">{{ errors.host }}</span>
          </div>

          <div class="form-group checkbox-group">
            <label><input type="checkbox" v-model="form.is_all_day" /> All Day</label>
          </div>

          <div class="form-group">
            <label>From<span class="mandatory">*</span></label>
            <input
              type="datetime-local"
              v-model="form.from_datetime"
              :class="{ 'input-error': errors.from_datetime }"
            />
            <span class="error-message">{{ errors.from_datetime }}</span>
          </div>

          <div class="form-group">
            <label>To<span class="mandatory">*</span></label>
            <input
              type="datetime-local"
              v-model="form.to_datetime"
              :class="{ 'input-error': errors.to_datetime }"
            />
            <span class="error-message">{{ errors.to_datetime }}</span>
          </div>

          <div class="form-group">
            <label>Related To</label>
            <select>
              <option value="">None</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div class="form-group">
            <label>Participants</label>
            <button type="button" class="btn-secondary" @click="showParticipantModal">
              Add Participants
            </button>
          </div>

          <div class="form-group">
            <label>Online Meeting</label>
            <input type="checkbox" v-model="form.is_online_meeting" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { meetingRepository, userRepository } from '@/services'
import '@/styles/shared/index.css'
import type { MeetingCreateEditPayload } from '@/types/meetings/meeting'
import type { UserOption } from '@/types/users/user'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const meetingHosts = ref<UserOption[]>([])

const form = reactive<MeetingCreateEditPayload>({
  title: '',
  location: '',
  from_datetime: '',
  to_datetime: '',
  is_all_day: false,
  is_online_meeting: false,
  host: 0,
  participants: [],
})

const errors = reactive({
  title: '',
  host: '',
  from_datetime: '',
  to_datetime: '',
})

const validateForm = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.host = ''
  errors.from_datetime = ''
  errors.to_datetime = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.host) {
    errors.host = 'Host is required'
    isValid = false
  }

  if (!form.from_datetime) {
    errors.from_datetime = 'Start time is required'
    isValid = false
  }

  if (!form.to_datetime) {
    errors.to_datetime = 'End time is required'
    isValid = false
  }

  return isValid
}

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const response = await userRepository.show()
    meetingHosts.value = response.results || response
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  if (validateForm()) {
    try {
      isLoading.value = true
      await meetingRepository.create(form)
      toast.success('Meeting created successfully', {
        position: POSITION.BOTTOM_RIGHT,
      })
      router.push('/meetings')
    } catch (error) {
      toast.error(error, {
        position: POSITION.BOTTOM_RIGHT,
      })
    } finally {
      isLoading.value = false
    }
  }
}

const handleCancel = () => {
  router.push('/meetings')
}

const showParticipantModal = () => {
  // Implement participant selection modal
}

onMounted(() => {
  fetchDropdownData()
})
</script>
