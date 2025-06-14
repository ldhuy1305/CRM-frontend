<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Edit Contact</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
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
            <label>Account Name<span class="mandatory">*</span></label>
            <select v-model="form.account">
              <option :value="null"></option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
            <span v-if="errors.accountId" class="error-message">{{ errors.accountId }}</span>
          </div>
          <div class="form-group">
            <label>Contact Owner</label>
            <select v-model="form.contactOwnerId">
              <!-- <option :value="null"></option> -->
              <option v-for="owner in contactOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Lead Source</label>
            <select v-model="form.leadSource">
              <option :value="null"></option>
              <option v-for="source in leadSources" :key="source.id" :value="source.id">
                {{ source.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Birthday</label>
            <Datepicker
              v-model="form.birthday"
              :enable-time-picker="false"
              format="yyyy-MM-dd"
              auto-apply
              locale="en"
              :hide-input-icon="true"
              :max="new Date().toISOString().split('T')[0]"
            />
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
            <label>Assistant Name</label>
            <input type="text" v-model="form.assistant_name" />
          </div>
          <div class="form-group">
            <label>Department</label>
            <input type="text" v-model="form.department" />
          </div>

          <div class="form-group">
            <label>Assistant Phone</label>
            <input type="tel" v-model="form.assistant_phone" />
          </div>
          <div class="form-group"></div>
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
  accountRepository,
  contactRepository,
  leadSourceRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import type { SelectOption } from '@/types/common/common_types'
import type { Contact, ContactCreateEditPayload } from '@/types/contacts/contact'
import type { UserOption } from '@/types/users/user'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const contact = ref<Contact>({} as Contact)
const contactOwners = ref<UserOption[]>([])
const accounts = ref<Account[]>([])
const leadSources = ref<SelectOption[]>([])
const contactId = route.params.id as string
const isLoading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  account: null as number | null,
  leadSource: null as number | null,
  contactOwnerId: null as number | null,
  email: '',
  phone: '',
  website: '',
  fax: '',
  department: '',
  birthday: null as Date | null,
  assistant_name: '',
  assistant_phone: '',
  avatar: '',
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
  accountId: '',
  email: '',
  website: '',
})

// --- Fetch Dropdown Data ---
const fetchDropdownData = async () => {
  console.log('Fetching dropdown data...') // Log start
  try {
    isLoading.value = true
    const [ownersRes, sourcesRes, accountRes] = await Promise.all([
      userRepository.show(),
      leadSourceRepository.show({ limit: 20 }),
      accountRepository.show({ limit: 20 }),
    ])

    contactOwners.value = ownersRes.results || ownersRes
    leadSources.value = sourcesRes.results || sourcesRes
    accounts.value = accountRes.results || accountRes
    console.log('Dropdown data fetched:', {
      owners: contactOwners.value,
      sources: leadSources.value,
      accounts: accounts.value,
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

const fetchContactDetails = async () => {
  try {
    const response = await contactRepository.index(contactId)
    console.log('✅ API Response:', response)
    contact.value = response.data || response

    console.log('✅ API Response:', contact.value)
    // Populate form fields
    form.firstName = contact.value.first_name || ''
    form.lastName = contact.value.last_name || ''
    form.email = contact.value.email || ''
    form.phone = contact.value.phone || ''
    form.website = contact.value.website || ''
    form.fax = contact.value.fax || ''
    form.department = contact.value.department || ''
    form.birthday = contact.value.birthday ? new Date(contact.value.birthday) : null
    form.assistant_name = contact.value.assistant_name || ''
    form.assistant_phone = contact.value.assistant_phone || ''
    form.callOptOut = contact.value.is_call_opt_out || false
    form.emailOptOut = contact.value.is_email_opt_out || false
    form.street = contact.value.street || ''
    form.city = contact.value.city || ''
    form.province = contact.value.state_province || ''
    form.postalCode = contact.value.postal_code || ''
    form.country = contact.value.country || ''
    form.description = contact.value.description || ''
    // Dropdowns
    form.contactOwnerId = contact.value.contact_owner?.id ?? null
    form.leadSource = contact.value.lead_source?.id ?? null
    form.account = contact.value.account ?? null
  } catch (error) {
    console.error('Error fetching lead details:', error)
  }
}

const validateForm = (): boolean => {
  // Clear previous errors
  errors.firstName = ''
  errors.lastName = ''
  errors.accountId = ''
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
  if (!form.account) {
    errors.accountId = 'Account Name is required.'
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
    const payload: ContactCreateEditPayload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      fax: form.fax.trim(),
      department: form.department.trim(),
      birthday: form.birthday ? new Date(form.birthday).toISOString().split('T')[0] : '',
      assistant_name: form.assistant_name.trim(),
      assistant_phone: form.assistant_phone.trim(),
      avatar: form.avatar.trim(),
      is_email_opt_out: form.emailOptOut,
      is_call_opt_out: form.callOptOut,
      street: form.street.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      state_province: form.province.trim(),
      postal_code: form.postalCode.trim(),
      description: form.description.trim(),
      contact_owner: form.contactOwnerId,
      lead_source: form.leadSource,
      account: form.account as number,
      company: '',
    }
    console.log('Prepared API Payload:', payload)
    try {
      isLoading.value = true
      await contactRepository.update(contactId, payload)
      console.log('Contact created successfully!')
      router.push(`/contacts/${contactId}`)
    } catch (error) {
      console.error('Error saving contact:', error)
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
  router.push('/contacts')
}

onMounted(() => {
  fetchDropdownData()
  fetchContactDetails()
})
</script>
