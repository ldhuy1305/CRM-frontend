<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Create Lead</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <!-- <button class="create-new-btn">Create & New</button> -->
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Information</h2>
        <div class="avatar-section">
          <div class="avatar-placeholder">
            <img src="@/assets/default_avatar.png" alt="Lead Avatar" />
          </div>
          <!-- <span class="edit-avatar">Edit avatar</span> -->
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>First Name<span class="mandatory">*</span></label>
            <input
              type="text"
              v-model="form.firstName"
              :class="{ 'input-error': errors.firstName }"
            />
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>
          <div class="form-group">
            <label>Last Name<span class="mandatory">*</span></label>
            <input
              type="text"
              v-model="form.lastName"
              :class="{ 'input-error': errors.lastName }"
            />
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>
          <div class="form-group">
            <label>Company<span class="mandatory">*</span></label>
            <input type="text" v-model="form.company" :class="{ 'input-error': errors.company }" />
            <span v-if="errors.company" class="error-message">{{ errors.company }}</span>
          </div>
          <div class="form-group">
            <label>Lead Owner</label>
            <select v-model="form.leadOwnerId">
              <!-- <option :value="null"></option> -->
              <option v-for="owner in leadOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" v-model="form.phone" />
          </div>
          <div class="form-group">
            <label>Website</label>
            <input type="url" v-model="form.website" />
            <span v-if="errors.website" class="error-message">{{ errors.website }}</span>
          </div>
          <div class="form-group">
            <label>Fax</label>
            <input type="tel" v-model="form.fax" />
          </div>
          <div class="form-group">
            <label>Lead Source</label>
            <select v-model="form.leadSourceId">
              <option :value="null"></option>
              <option v-for="source in leadSources" :key="source.id" :value="source.id">
                {{ source.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Lead Status</label>
            <select v-model="form.leadStatusId">
              <option :value="null"></option>
              <option v-for="status in leadStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Industry</label>
            <select v-model="form.industryId">
              <option :value="null"></option>
              <option
                v-for="industryItem in industries"
                :key="industryItem.id"
                :value="industryItem.id"
              >
                {{ industryItem.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Annual Revenue</label>
            <input type="number" v-model="form.annualRevenue" />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.callOptOut" />
              Call Opt Out
            </label>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.emailOptOut" />
              Email Opt Out
            </label>
          </div>
        </div>
      </div>

      <div class="address-section">
        <h2>Address Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Street</label>
            <input type="text" v-model="form.street" />
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="form.city" />
          </div>
          <div class="form-group">
            <label>Province</label>
            <input type="text" v-model="form.province" />
          </div>
          <div class="form-group">
            <label>Postal code</label>
            <input type="text" v-model="form.postalCode" />
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="form.country" />
          </div>
        </div>
      </div>

      <div class="description-section">
        <h2>Description Information</h2>
        <div class="form-group">
          <textarea v-model="form.description" rows="6"></textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import {
  industryRepository,
  leadRepository,
  leadSourceRepository,
  leadStatusRepository,
  userRepository,
} from '@/services'

import '@/styles/shared/index.css'
import type { SelectOption } from '@/types/common/common_types'
import type { LeadCreateEditPayload } from '@/types/leads/lead'
import type { UserOption } from '@/types/users/user'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const leadOwners = ref<UserOption[]>([])
const leadSources = ref<SelectOption[]>([])
const leadStatuses = ref<SelectOption[]>([])
const industries = ref<SelectOption[]>([])
const isLoading = ref(false)

import { useAuthStore } from '@/stores/modules/auth'
const authStore = useAuthStore()
const getCurrentUserId = (): number => {
  if (authStore.user) {
    console.log('Current User ID:', authStore.user.user.id)
    return authStore?.user.user.id
  } else {
    return 0
  }
}

const form = reactive({
  firstName: '',
  lastName: '',
  company: '',
  leadOwnerId: getCurrentUserId(),
  leadSourceId: null as number | null,
  leadStatusId: null as number | null,
  industryId: null as number | null,
  email: '',
  phone: '',
  website: '',
  fax: '',
  annualRevenue: '',
  callOptOut: false,
  emailOptOut: false,
  street: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  description: '',
})

// Reactive object to hold validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  website: '',
})

// --- Fetch Dropdown Data ---
const fetchDropdownData = async () => {
  console.log('Fetching dropdown data...') // Log start
  try {
    isLoading.value = true
    const [ownersRes, sourcesRes, statusesRes, industriesRes] = await Promise.all([
      userRepository.show(),
      leadSourceRepository.show({ limit: 20 }),
      leadStatusRepository.show({ limit: 20 }),
      industryRepository.show({ limit: 20 }),
    ])

    leadOwners.value = ownersRes.results || ownersRes
    leadSources.value = sourcesRes.results || sourcesRes
    leadStatuses.value = statusesRes.results || statusesRes
    industries.value = industriesRes.results || industriesRes
    console.log('Dropdown data fetched:', {
      owners: leadOwners.value,
      sources: leadSources.value,
      statuses: leadStatuses.value,
      industries: industries.value,
    })
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDropdownData()
})

const validateForm = (): boolean => {
  // Clear previous errors
  errors.firstName = ''
  errors.lastName = ''
  errors.company = ''
  errors.email = ''
  errors.website = ''

  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = 'First Name is required.'
    isValid = false
  }
  if (!form.lastName.trim()) {
    errors.lastName = 'Last Name is required.'
    isValid = false
  }
  if (!form.company.trim()) {
    errors.company = 'Company is required.'
    isValid = false
  }

  // Email validation for @gmail.com
  if (form.email.trim()) {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/
    if (!emailRegex.test(form.email.trim())) {
      errors.email = 'Email must end with @gmail.com'
      isValid = false
    }
  }

  // Website validation for http:// or https://
  if (form.website.trim()) {
    const websiteRegex = /^https?:\/\/.+/
    if (!websiteRegex.test(form.website.trim())) {
      errors.website = 'Website must start with http:// or https://'
      isValid = false
    }
  }

  return isValid
}

const handleSave = async () => {
  if (validateForm()) {
    console.log('Validation successful. Preparing to save:', form)
    // Prepare the payload
    const payload: LeadCreateEditPayload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      company_name: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      fax: form.fax.trim(),
      annual_revenue: form.annualRevenue ? form.annualRevenue.toString() : '0',
      is_email_opt_out: form.emailOptOut,
      is_call_opt_out: form.callOptOut,
      street: form.street.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      state_province: form.province.trim(),
      postal_code: form.postalCode.trim(),
      description: form.description.trim(),
      lead_owner: form.leadOwnerId || 3,
      lead_source: form.leadSourceId,
      lead_status: form.leadStatusId,
      industry: form.industryId,
    }

    console.log('Prepared API Payload:', payload)

    try {
      isLoading.value = true
      await leadRepository.create(payload)
      console.log('Lead created successfully!')
      router.push('/leads')
    } catch (error) {
      console.error('Error saving lead:', error)
      toast.error(error, {
        icon: '❌',
        position: POSITION.BOTTOM_RIGHT,
      })
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('Validation failed.')
  }
}

const handleCancel = () => {
  router.push('/leads')
}
</script>
