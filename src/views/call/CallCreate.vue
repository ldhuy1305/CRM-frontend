<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>{{ isSchedule ? 'Schedule a call' : 'Log a call' }}</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="router.back()">Cancel</button>
        <button class="btn-primary" @click="handleSubmit">Create</button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="call-information">
        <h3>Call Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="form.title" />
          </div>

          <div class="form-group">
            <label>Call Type<span class="required">*</span></label>
            <select v-model="form.call_type" :class="{ error: submitted && !form.call_type }">
              <option value="" disabled>Select Type</option>
              <option v-for="type in callTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Call For<span class="required">*</span></label>
            <select v-model="form.contact" :class="{ error: submitted && !form.contact }">
              <option value="" disabled>Select Contact</option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.last_name }} {{ contact.first_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Related To</label>
            <select v-model="form.related_account">
              <option value="" disabled>Select Account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Start Time<span class="required">*</span></label>
            <input
              type="datetime-local"
              v-model="form.start_time"
              :class="{ error: submitted && !form.start_time }"
            />
          </div>

          <div class="form-group" v-if="!isSchedule">
            <label>Call Duration</label>
            <input type="number" v-model="form.duration" min="1" />
          </div>

          <div class="form-group">
            <label>Call Owner<span class="required">*</span></label>
            <select v-model="form.call_owner" :class="{ 'input-error': errors.call_owner }">
              <option value="" disabled>Select Owner</option>
              <option v-for="owner in callOwner" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
            <span v-if="errors.call_owner" class="error-message">{{ errors.call_owner }}</span>
          </div>

          <div class="form-group" v-if="isSchedule">
            <label><input type="checkbox" v-model="form.is_remind" /> Remind</label>
          </div>
        </div>
      </div>

      <div class="purpose-section">
        <h3>Purpose Of Outgoing Call</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Call Purpose<span class="required">*</span></label>
            <select v-model="form.call_purpose" :class="{ 'input-error': errors.call_purpose }">
              <option value="" disabled>Select Purpose</option>
              <option v-for="purpose in callPurposes" :key="purpose.id" :value="purpose.id">
                {{ purpose.name }}
              </option>
            </select>
            <span v-if="errors.call_purpose" class="error-message">{{ errors.call_purpose }}</span>
          </div>

          <div class="form-group">
            <label>Call Agenda</label>
            <textarea v-model="form.call_agenda" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="outcome-section" v-if="!isSchedule">
        <h3>Outcome Of Outgoing Call</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Call Result</label>
            <select v-model="form.call_result">
              <option value="null" disabled>Select Result</option>
              <option v-for="result in callResults" :key="result.id" :value="result.id">
                {{ result.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import {
  accountRepository,
  callPurposeRepository,
  callRepository,
  callResultRepository,
  callTypeRepository,
  contactRepository,
  userRepository,
} from '@/services'
import type { Account } from '@/types/accounts/account'
import type { CallCreateEditPayload, CallPurpose, CallResult, CallType } from '@/types/calls/call'
import type { Contact } from '@/types/contacts/contact'
import type { UserInfo } from '@/types/users/user'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const isSchedule = computed(() => route.query.type === 'schedule')

const form = reactive<CallCreateEditPayload>({
  title: '',
  description: '',
  call_type: 0,
  call_purpose: null,
  call_result: null,
  call_owner: 0,
  related_deal: null,
  related_account: null,
  lead: null,
  contact: null,
  start_time: '',
  duration: 0,
  call_agenda: '',
  voice_recording: '',
  is_remind: false,
})

const contacts = ref<Contact[]>([])
const accounts = ref<Account[]>([])
const callTypes = ref<CallType[]>([])
const callPurposes = ref<CallPurpose[]>([])
const callResults = ref<CallResult[]>([])
const callOwner = ref<UserInfo[]>([])

const errors = reactive({
  call_type: '',
  contact: '',
  start_time: '',
  call_owner: '',
  call_purpose: '',
})

const submitted = ref(false)

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const [typesRes, purposesRes, resultsRes, accountRes, contactRes, ownerRes] = await Promise.all(
      [
        callTypeRepository.show(),
        callPurposeRepository.show(),
        callResultRepository.show(),
        accountRepository.show(),
        contactRepository.show(),
        userRepository.show(),
      ],
    )
    callTypes.value = typesRes.results || typesRes
    callPurposes.value = purposesRes.results || purposesRes
    callResults.value = resultsRes.results || resultsRes
    accounts.value = accountRes.results || accountRes
    contacts.value = contactRes.results || contactRes
    callOwner.value = ownerRes.results || ownerRes
  } catch (error) {
    console.error('Error fetching dropdown data:', error)
    toast.error('Failed to load form data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.call_type) {
    errors.call_type = 'Call type is required.'
    isValid = false
  }

  if (!form.contact) {
    errors.contact = 'Call for is required.'
    isValid = false
  }

  if (!form.start_time) {
    errors.start_time = 'Start time is required.'
    isValid = false
  }

  if (!form.call_owner) {
    errors.call_owner = 'Call owner is required.'
    isValid = false
  }

  if (!form.call_purpose) {
    errors.call_purpose = 'Call purpose is required.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      isLoading.value = true
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        duration: Number(form.duration),
        is_remind: isSchedule.value ? form.is_remind : false,
      }

      console.log('Prepared API Payload:', payload)
      await callRepository.create(payload)
      console.log('Call created successfully!')

      toast.success('Call created successfully', {
        position: POSITION.BOTTOM_RIGHT,
      })
      router.push('/calls')
    } catch (error) {
      console.error('Error creating call:', error)
      toast.error('Failed to create call', {
        position: POSITION.BOTTOM_RIGHT,
      })
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('Validation failed. Errors:', errors)
  }
}

onMounted(() => {
  fetchDropdownData()
})
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.call-information,
.purpose-section,
.outcome-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 16px;
}

.required {
  color: red;
  margin-left: 4px;
}

.error {
  border-color: red;
}

.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
