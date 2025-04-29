<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Edit Account</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Account Information</h2>
        <div class="avatar-section">
          <div class="avatar-placeholder">
            <img src="@/assets/company_avatar.svg" alt="Account Avatar" />
          </div>
          <span class="edit-avatar">Edit avatar</span>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Account Name<span class="mandatory">*</span></label>
            <input type="text" v-model="form.name" :class="{ 'input-error': errors.name }" />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>Account Owner</label>
            <select v-model="form.accountOwnerId">
              <option :value="null"></option>
              <option v-for="owner in accountOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Website</label>
            <input type="url" v-model="form.website" />
            <span v-if="errors.website" class="error-message">{{ errors.website }}</span>
          </div>
          <div class="form-group">
            <label>Account Type</label>
            <select v-model="form.accountTypeId">
              <option :value="null"></option>
              <option v-for="type in accountTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" v-model="form.phone" />
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
            <label>Fax</label>
            <input type="tel" v-model="form.fax" />
          </div>
          <div class="form-group">
            <label>Rating</label>
            <select v-model="form.ratingId">
              <option :value="null"></option>
              <option v-for="ratingItem in ratingList" :key="ratingItem.id" :value="ratingItem.id">
                {{ ratingItem.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Tax Code</label>
            <input type="text" v-model="form.taxCode" />
          </div>
          <div class="form-group">
            <label>Annual Revenue</label>
            <input type="number" v-model="form.annualRevenue" />
          </div>
          <div class="form-group">
            <label>Employees</label>
            <input type="number" v-model="form.employees" />
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
  accountTypeRepository,
  industryRepository,
  ratingRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { Account, AccountCreateEditPayload } from '@/types/accounts/account'
import type { SelectOption } from '@/types/common/common_types'
import type { UserOption } from '@/types/users/user'
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const isLoading = ref(false)

const accountOwners = ref<UserOption[]>([])
const account = ref<Account | null>(null)
const industries = ref<SelectOption[]>([])
const accountTypes = ref<SelectOption[]>([])
const ratingList = ref<SelectOption[]>([])
const accountId = route.params.id as string

const form = reactive({
  accountOwnerId: null as number | null,
  accountTypeId: null as number | null,
  industryId: null as number | null,
  ratingId: null as number | null,
  name: '',
  email: '',
  phone: '',
  website: '',
  fax: '',
  taxCode: '',
  employees: 0,
  avatar: '',
  annualRevenue: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  description: '',
})

// Reactive object to hold validation errors
const errors = reactive({
  name: '',
  website: '',
})

// --- Fetch Dropdown Data ---
const fetchDropdownData = async () => {
  console.log('Fetching dropdown data...') // Log start
  try {
    isLoading.value = true
    const [ownersRes, industriesRes, accountTypeRes, ratingRes] = await Promise.all([
      userRepository.show(),
      industryRepository.show({ limit: 20 }),
      accountTypeRepository.show({ limit: 20 }),
      ratingRepository.show({ limit: 20 }),
    ])

    accountOwners.value = ownersRes.results || ownersRes
    industries.value = industriesRes.results || industriesRes
    accountTypes.value = accountTypeRes.results || accountTypeRes
    ratingList.value = ratingRes.results || ratingRes
    console.log('Dropdown data fetched:', {
      owners: accountOwners.value,
      industries: industries.value,
      accountTypes: accountTypes.value,
      ratings: ratingList.value,
    })
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  }
}

const fetchAccountDetails = async () => {
  try {
    isLoading.value = true
    const response = await accountRepository.index(accountId)
    console.log('✅ API Response:', response)
    account.value = response || null

    console.log('✅ API Response:', account.value)
    // Populate form fields
    if (account.value) {
      form.name = account.value.name || ''
      form.phone = account.value.phone || ''
      form.website = account.value.website || ''
      form.fax = account.value.fax || ''
      form.taxCode = account.value.tax_code || ''
      form.employees = account.value.employees || 0
      form.avatar = account.value.avatar || ''
      form.annualRevenue = String(Number(account.value.annual_revenue)) || ''
      form.street = account.value.street || ''
      form.city = account.value.city || ''
      form.province = account.value.state_province || ''
      form.postalCode = account.value.postal_code || ''
      form.country = account.value.country || ''
      form.description = account.value.description || ''
      form.accountOwnerId = account.value.account_owner?.id ?? null
      form.accountTypeId = account.value.account_type?.id ?? null
      form.industryId = account.value.industry?.id ?? null
      form.ratingId = account.value.rating?.id ?? null
    }
  } catch (error) {
    console.error('Error fetching lead details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDropdownData()
  fetchAccountDetails()
})

const validateForm = (): boolean => {
  // Clear previous errors
  errors.name = ''
  errors.website = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Account name is required.'
    isValid = false
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
    const payload: AccountCreateEditPayload = {
      name: form.name,
      phone: form.phone,
      fax: form.fax,
      website: form.website,
      tax_code: form.taxCode,
      employees: Number(form.employees) || null,
      annual_revenue: form.annualRevenue,
      street: form.street,
      country: form.country,
      city: form.city,
      state_province: form.province,
      postal_code: form.postalCode,
      description: form.description,
      account_owner: form.accountOwnerId || null,
      industry: form.industryId || null,
      rating: form.ratingId || null,
      account_type: form.accountTypeId || null,
    }
    console.log('Prepared API Payload:', payload)
    try {
      isLoading.value = true
      await accountRepository.update(accountId, payload)
      console.log('Account updated successfully!')
      router.push('/accounts')
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
  router.push('/accounts')
}
</script>
