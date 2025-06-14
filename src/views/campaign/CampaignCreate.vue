<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Create Campaign</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Campaign Information</h2>

        <div class="form-grid">
          <div class="form-group">
            <label>Campaign Owner<span class="mandatory">*</span></label>
            <select v-model="form.campaignOwnerId" :class="{ 'input-error': errors.campaignOwner }">
              <option v-for="owner in campaignOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
            <span v-if="errors.campaignOwner" class="error-message">{{
              errors.campaignOwner
            }}</span>
          </div>
          <div class="form-group">
            <label>Type<span class="mandatory">*</span></label>
            <select v-model="form.campaignTypeId" :class="{ 'input-error': errors.campaignType }">
              <option v-for="type in campaignTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
            <span v-if="errors.campaignType" class="error-message">{{ errors.campaignType }}</span>
          </div>
          <div class="form-group">
            <label>Campaign Name<span class="mandatory">*</span></label>
            <input type="text" v-model="form.name" :class="{ 'input-error': errors.name }" />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.campaignStatusId">
              <option :value="null"></option>
              <option v-for="status in campaignStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <Datepicker
              v-model="form.startDate"
              :enable-time-picker="false"
              format="yyyy-MM-dd"
              auto-apply
              locale="en"
              :hide-input-icon="true"
            />
          </div>
          <div class="form-group">
            <label>End Date</label>
            <Datepicker
              v-model="form.endDate"
              :enable-time-picker="false"
              format="yyyy-MM-dd"
              auto-apply
              locale="en"
              :hide-input-icon="true"
              :min-date="form.startDate || undefined"
            />
          </div>
          <div class="form-group">
            <label>Expected Revenue</label>
            <input type="number" v-model="form.expectedRevenue" />
          </div>
          <div class="form-group">
            <label>Budgeted Cost</label>
            <input type="number" v-model="form.budgetedCost" />
          </div>
          <div class="form-group">
            <label>Actual Cost</label>
            <input type="number" v-model="form.actualCost" />
          </div>
          <div class="form-group">
            <label>Expected Response</label>
            <input type="number" v-model="form.expectedResponse" />
          </div>
          <div class="form-group">
            <label>Numbers sent</label>
            <input type="number" v-model="form.numbersSent" />
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
  campaignRepository,
  campaignStatusRepository,
  campaignTypeRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { CampaignCreateEditPayload } from '@/types/campaigns/campaign'
import type { SelectOption } from '@/types/common/common_types'
import type { UserOption } from '@/types/users/user'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const campaignOwners = ref<UserOption[]>([])
const campaignTypes = ref<SelectOption[]>([])
const campaignStatuses = ref<SelectOption[]>([])

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
  campaignOwnerId: getCurrentUserId(),
  campaignTypeId: 0,
  campaignStatusId: 0,
  startDate: null as Date | null,
  endDate: null as Date | null,
  expectedRevenue: '',
  budgetedCost: '',
  actualCost: '',
  expectedResponse: 0,
  numbersSent: 0,
  description: '',
})

const errors = reactive({
  name: '',
  campaignOwner: '',
  campaignType: '',
})

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const [ownersRes, typesRes, statusesRes] = await Promise.all([
      userRepository.show(),
      campaignTypeRepository.show(),
      campaignStatusRepository.show(),
    ])

    campaignOwners.value = ownersRes.results || ownersRes
    campaignTypes.value = typesRes.results || typesRes
    campaignStatuses.value = statusesRes.results || statusesRes
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const validateForm = (): boolean => {
  errors.name = ''
  errors.campaignOwner = ''
  errors.campaignType = ''
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Campaign name is required.'
    isValid = false
  }

  if (!form.campaignOwnerId) {
    errors.campaignOwner = 'Campaign owner is required.'
    isValid = false
  }

  if (!form.campaignTypeId) {
    errors.campaignType = 'Campaign type is required.'
    isValid = false
  }

  return isValid
}

const handleSave = async () => {
  if (validateForm()) {
    try {
      isLoading.value = true
      const payload: CampaignCreateEditPayload = {
        name: form.name.trim(),
        campaign_owner: form.campaignOwnerId,
        campaign_type: form.campaignTypeId,
        campaign_status: form.campaignStatusId,
        start_date: form.startDate ? form.startDate.toISOString().split('T')[0] : null,
        end_date: form.endDate ? form.endDate.toISOString().split('T')[0] : null,
        expected_revenue: form.expectedRevenue,
        budgeted_cost: form.budgetedCost,
        actual_cost: form.actualCost,
        expected_response: form.expectedResponse,
        numbers_sent: form.numbersSent,
        description: form.description.trim(),
      }

      await campaignRepository.create(payload)
      router.push('/campaigns')
    } catch (error) {
      toast.error(error, {
        icon: '❌',
        position: POSITION.BOTTOM_RIGHT,
      })
    } finally {
      isLoading.value = false
    }
  }
}

const handleCancel = () => {
  router.push('/campaigns')
}

onMounted(() => {
  fetchDropdownData()
})
</script>
