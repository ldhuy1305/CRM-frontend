<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <!-- Header -->
    <div class="module-header">
      <h1>Edit Deal</h1>
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
            <label>Deal Owner</label>
            <select v-model="form.owner_id">
              <option :value="null"></option>
              <option v-for="owner in dealOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
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
            <label>Contact Name</label>
            <select v-model="form.contact_id">
              <option :value="null"></option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.first_name }} {{ contact.last_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Campaign Source</label>
            <select v-model="form.campaign_source">
              <option :value="null"></option>
              <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                {{ campaign.name }}
              </option>
            </select>
          </div>

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

      <div class="form-grid">
        <!-- ...existing form groups... -->

        <div class="form-group">
          <label> <input type="checkbox" v-model="form.is_lost" /> Is Lost </label>
        </div>

        <div class="form-group" v-if="form.is_lost">
          <label>Lost Reason<span class="mandatory">*</span></label>
          <select
            v-model="form.lost_reason"
            :class="{ 'input-error': errors.lost_reason }"
            required
          >
            <option :value="null"></option>
            <option v-for="reason in dealLostReasons" :key="reason.id" :value="reason.id">
              {{ reason.reason }}
            </option>
          </select>
          <span v-if="errors.lost_reason" class="error-message">{{ errors.lost_reason }}</span>
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
  dealLostReasonRepository,
  dealsRepository,
  stageRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import type { SelectOption } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { Deal, DealCreateEditPayload, DealLostReason } from '@/types/deals/deal'
import type { UserOption } from '@/types/users/user'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const amount = ref<number | null>(null)
const router = useRouter()
const route = useRoute()
const toast = useToast()
const isLoading = ref(false)
const dealId = route.params.id as string

const dealOwners = ref<UserOption[]>([])
const stages = ref<SelectOption[]>([])
const accounts = ref<Account[]>([])
const contacts = ref<Contact[]>([])
const campaigns = ref<SelectOption[]>([])
const deal = ref<Deal>({} as Deal)
const dealLostReasons = ref<DealLostReason[]>([])

const form = reactive({
  name: '',
  owner_id: 0,
  amount: 0,
  close_date: '',
  account_id: 0,
  stage_id: 0,
  probability: 10,
  expected_revenue: 0,
  campaign_source: null as number | null,
  contact_id: 0,
  description: '',
  lost_reason: null as number | null,
  is_lost: false,
})

const errors = reactive({
  name: '',
  amount: '',
  close_date: '',
  stage_id: '',
  account_id: '',
  lost_reason: '',
})

const validateForm = (): boolean => {
  let isValid = true

  // Clear previous errors
  // Object.keys(errors).forEach((key) => (errors[key] = ''))
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

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

  if (form.is_lost && !form.lost_reason) {
    errors.lost_reason = 'Lost reason is required when deal is marked as lost.'
    isValid = false
  }

  return isValid
}

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const [ownersRes, stagesRes, accountsRes, contactRes, lostRes] = await Promise.all([
      userRepository.show({ limit: 20 }),
      stageRepository.show({ limit: 20 }),
      accountRepository.show({ limit: 20 }),
      contactRepository.show({ limit: 20 }),
      dealLostReasonRepository.show({ limit: 20 }),
    ])

    dealOwners.value = ownersRes.results || ownersRes
    stages.value = stagesRes.results || stagesRes
    accounts.value = accountsRes.results || accountsRes
    contacts.value = contactRes.results || contactRes
    dealLostReasons.value = lostRes.results || lostRes

    console.log('Deal Owners:', dealOwners.value)
    console.log('Stages:', stages.value)
    console.log('Accounts:', accounts.value)
    console.log('Contacts:', contacts.value)
    console.log('Deal Lost Reasons:', dealLostReasons.value)
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const fetchDealDetails = async () => {
  try {
    const dealRes = await dealsRepository.index(dealId); 
deal.value = dealRes.data;  


    console.log('✅ API Response:', deal.value)
    // Populate form with deal data
    form.name = deal.value.name || ''
    form.owner_id = deal.value.deal_owner.id || 0
    form.amount = Number(deal.value.amount) || 0
    form.close_date = deal.value.close_date || ''
    form.account_id = deal.value.account.id || 0
    form.stage_id = deal.value.stage.id || 0
    form.contact_id = deal.value.contact?.id || 0
    form.probability = deal.value.probability * 100
    form.expected_revenue = Number(deal.value.expected_revenue)
    form.description = deal.value.description || ''
    form.campaign_source = deal.value.campaign?.id || null
    form.is_lost = deal.value.is_lost || false
    form.lost_reason = deal.value.lost_reason?.id || null
  } catch (error) {
    toast.error('Failed to fetch deal details', {
      position: POSITION.BOTTOM_RIGHT,
    })
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
        contact: form.contact_id || null,
        expected_revenue: form.expected_revenue,
        is_lost: form.is_lost,
        lost_reason: form.is_lost ? form.lost_reason : null,
        campaign: form.campaign_source,
      }

      await dealsRepository.update(dealId, payload)
      toast.success('Deal updated successfully', {
        icon: '✅',
        position: POSITION.BOTTOM_RIGHT,
      })
      router.push(`/deals/${dealId}`)
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
  router.push('/deals')
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([fetchDropdownData(), fetchDealDetails()])
  isLoading.value = false
})

watch(
  [() => form.amount, () => form.probability],
  ([newAmount, newProbability]) => {
    form.expected_revenue = (newAmount * newProbability) / 100
  },
  { immediate: true },
)
</script>
