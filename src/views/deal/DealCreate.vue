<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <!-- Header -->
    <div class="module-header">
      <h1>Create Deal</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Deal Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Deal Name<span class="mandatory">*</span></label>
            <input
              type="text"
              v-model="form.name"
              :class="{ 'input-error': errors.name }"
              required
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label>Deal Owner<span class="mandatory">*</span></label>
            <select v-model="form.owner_id" :class="{ 'input-error': errors.owner }">
              <!-- <option :value="null"></option> -->
              <option v-for="owner in dealOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
            <span v-if="errors.owner" class="error-message">{{ errors.owner }}</span>
          </div>

          <div class="form-group">
            <label>Amount<span class="mandatory">*</span></label>
            <input type="number" v-model="form.amount" :class="{ 'input-error': errors.amount }" />
            <span v-if="errors.amount" class="error-message">{{ errors.amount }}</span>
          </div>

          <div class="form-group">
            <label>Closing Date<span class="mandatory">*</span></label>
            <input
              type="date"
              v-model="form.close_date"
              :class="{ 'input-error': errors.close_date }"
              required
            />
            <span v-if="errors.close_date" class="error-message">{{ errors.close_date }}</span>
          </div>

          <div class="form-group">
            <label>Account Name<span class="mandatory">*</span></label>
            <select v-model="form.account_id" :class="{ 'input-error': errors.account_id }">
              <option :value="null"></option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
            <span v-if="errors.account_id" class="error-message">{{ errors.account_id }}</span>
          </div>

          <div class="form-group">
            <label>Stage<span class="mandatory">*</span></label>
            <select v-model="form.stage_id" :class="{ 'input-error': errors.stage_id }" required>
              <option :value="null"></option>
              <option v-for="stage in stages" :key="stage.id" :value="stage.id">
                {{ stage.name }}
              </option>
            </select>
            <span v-if="errors.stage_id" class="error-message">{{ errors.stage_id }}</span>
          </div>

          <div class="form-group">
            <label>Contact Name<span class="mandatory">*</span></label>
            <select v-model="form.contact_id" :class="{ 'input-error': errors.contact }">
              <option :value="null"></option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.first_name }} {{ contact.last_name }}
              </option>
            </select>
            <span v-if="errors.contact" class="error-message">{{ errors.contact }}</span>
          </div>

          <div class="form-group"></div>

          <div class="form-group">
            <label>Probability (%)</label>
            <input type="number" v-model="form.probability" min="0" max="100" />
          </div>

          <div class="form-group">
            <label>Expected Revenue</label>
            <input type="number" v-model="form.expected_revenue" disabled />
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
  dealsRepository,
  stageRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import type { SelectOption } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { DealCreateEditPayload } from '@/types/deals/deal'
import type { UserOption } from '@/types/users/user'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const dealOwners = ref<UserOption[]>([])
const stages = ref<SelectOption[]>([])
const accounts = ref<Account[]>([])
const contacts = ref<Contact[]>([])

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
  name: '',
  owner_id: getCurrentUserId(),
  amount: 0,
  close_date: '',
  account_id: 0,
  stage_id: 1,
  type: '',
  probability: 10,
  next_step: '',
  expected_revenue: 0,
  campaign_source: null as number | null,
  contact_id: 0,
  description: '',
})

const errors = reactive({
  name: '',
  amount: '',
  close_date: '',
  stage_id: '',
  account_id: '',
  owner: '',
  contact: '',
})

const validateForm = (): boolean => {
  // Clear previous errors
  errors.name = ''
  errors.amount = ''
  errors.close_date = ''
  errors.stage_id = ''
  errors.account_id = ''
  errors.owner = ''
  errors.contact = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Deal Name is required.'
    isValid = false
  }

  if (!form.amount || form.amount <= 0) {
    errors.amount = 'Amount must be greater than 0.'
    isValid = false
  }

  if (!form.close_date) {
    errors.close_date = 'Closing Date is required.'
    isValid = false
  }

  if (!form.stage_id) {
    errors.stage_id = 'Stage is required.'
    isValid = false
  }

  if (!form.account_id) {
    errors.account_id = 'Account Name is required.'
    isValid = false
  }

  if (!form.owner_id) {
    errors.owner = 'Deal Owner is required.'
    isValid = false
  }

  if (!form.contact_id) {
    errors.contact = 'Contact is required.'
    isValid = false
  }

  return isValid
}

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const [ownersRes, stagesRes, accountsRes, contactRes] = await Promise.all([
      userRepository.show(),
      stageRepository.show(),
      accountRepository.show(),
      contactRepository.show(),
    ])

    dealOwners.value = ownersRes.results || ownersRes
    stages.value = stagesRes.results || stagesRes
    accounts.value = accountsRes.results || accountsRes
    contacts.value = contactRes.results || contactRes

    console.log('Deal Owners:', dealOwners.value)
    console.log('Stages:', stages.value)
    console.log('Accounts:', accounts.value)
    console.log('Contacts:', contacts.value)
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
      const payload: DealCreateEditPayload = {
        name: form.name.trim(),
        amount: Number(form.amount),
        close_date: form.close_date,
        stage: form.stage_id,
        deal_owner: form.owner_id,
        probability: form.probability / 100,
        description: form.description?.trim(),
        account: form.account_id,
        contact: form.contact_id,
        expected_revenue: form.expected_revenue,
        is_lost: false,
        lost_reason: null,
        campaign: form.campaign_source,
      }

      const response = await dealsRepository.create(payload)
      toast.success('Deal created successfully', {
        icon: '✅',
        position: POSITION.BOTTOM_RIGHT,
      })
      // router.push('/deals')
      router.push(`/deals/${response.id}`)
    } catch (error) {
      toast.error(error, {
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
  router.push('/deals')
}

onMounted(() => {
  fetchDropdownData()
})

watch(
  [() => form.amount, () => form.probability],
  ([newAmount, newProbability]) => {
    form.expected_revenue = (newAmount * newProbability) / 100
  },
  { immediate: true },
)
</script>
