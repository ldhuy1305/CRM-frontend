<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
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

        <div class="form-actions">
          <button class="btn-primary" @click="handleConvert">Convert</button>
          <button class="btn-secondary" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
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
const isLoading = ref(false)

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
    isLoading.value = true
    const leadId = Number(route.params.id)
    console.log('API payload:', payload)

    const convertResponse = await leadRepository.convert(leadId, payload)
    console.log('Lead convert successfully!')
    toast.success('Lead converted successfully!', {
      icon: '✅',
      position: POSITION.BOTTOM_RIGHT,
    })

    // Extract contact ID from the response
    let contactId: number | undefined

    if (convertResponse?.contact?.id) {
      contactId = convertResponse.contact.id
    } else if (convertResponse?.data?.contact?.id) {
      contactId = convertResponse.data.contact.id
    } else if (convertResponse?.contact_id) {
      contactId = convertResponse.contact_id
    } else if (convertResponse?.data?.contact_id) {
      contactId = convertResponse.data.contact_id
    }

    console.log('Extracted contact ID:', contactId)
    if (contactId) {
      router.push(`/contacts/${contactId}`)
    } else {
      router.push('/contacts')
    }
  } catch (error) {
    console.error('Error converting lead:', error)
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
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
    isLoading.value = true
    const leadId = route.params.id as string
    const response = await leadRepository.index(leadId)
    console.log('✅ API Response:', response)
    lead.value = response.data || response
    form.value.account_owner = lead.value.lead_owner?.id
  } catch (error) {
    console.error('Error fetching lead details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDropdownData()
  fetchLeadDetails()
})
</script>
