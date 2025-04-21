<template>
  <div class="page-container">
    <div class="content">
      <h1 class="page-title">
        Convert Lead
        <span class="lead-name"
          >( {{ lead.last_name }} {{ lead.first_name }} - {{ lead.company_name }} )</span
        >
      </h1>
      <div class="convert-form">
        <div class="form-row">
          <label>Create New Account</label>
          <div class="convert-tag">{{ lead.company_name }}</div>
        </div>

        <div class="form-row">
          <label>Create New Contact</label>
          <div class="convert-tag">{{ lead.last_name }} {{ lead.first_name }}</div>
        </div>

        <div class="form-row checkbox-row">
          <input type="checkbox" id="create-deal" class="checkbox" v-model="form.is_create_deal" />
          <label for="create-deal">Create a new Deal for this Account.</label>
        </div>

        <div class="form-row">
          <label>Owner of the new Account</label>
          <div class="select-owner">
            <select class="select-input" v-model="form.account_owner" required>
              <option v-for="owner in newOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row checkbox-row">
          <input type="checkbox" id="notify-owner" class="checkbox" />
          <label for="notify-owner">Notify owner (Account and Contact).</label>
        </div>

        <div class="form-actions">
          <button class="btn-primary" @click="handleConvert">Convert</button>
          <button class="btn-secondary" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { leadRepository, userRepository } from '@/services'
import '@/styles/lead/convert.css'
import '@/styles/shared/index.css'
import type { Lead, LeadConvertPayload } from '@/types/leads/lead'
import type { UserOption } from '@/types/users/user'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const lead = ref<Lead>({} as Lead)
const newOwners = ref<UserOption[]>([])
const toast = useToast()

const form = ref<LeadConvertPayload>({
  account_owner: 0,
  is_create_deal: false,
})

const handleCancel = () => {
  router.go(-1)
}

const handleConvert = async () => {
  const payload: LeadConvertPayload = {
    account_owner: form.value.account_owner,
    is_create_deal: form.value.is_create_deal,
  }

  try {
    const leadId = Number(route.params.id)
    console.log('API payload:', payload)

    await leadRepository.convert(leadId, payload)
    console.log('Lead convert successfully!')
    router.push('/leads')
    toast.success('Convert lead successfully', {
      icon: '✅',
      position: POSITION.BOTTOM_RIGHT,
    })
  } catch (error) {
    console.error('Error converting lead:', error)
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  }
}

const fetchDropdownData = async () => {
  try {
    const [ownersRes] = await Promise.all([userRepository.show()])
    newOwners.value = ownersRes.results || ownersRes
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  }
}

const fetchLeadDetails = async () => {
  try {
    const leadId = route.params.id as string
    const response = await leadRepository.index(leadId)
    console.log('✅ API Response:', response)
    lead.value = response
    form.value.account_owner = lead.value.lead_owner?.id
  } catch (error) {
    console.error('Error fetching lead details:', error)
  }
}

onMounted(() => {
  fetchDropdownData()
  fetchLeadDetails()
})
</script>
