<template>
  <div class="lead-convert-page">
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
          <div class="tag">{{ lead.company_name }}</div>
        </div>

        <div class="form-row">
          <label>Create New Contact</label>
          <div class="tag">{{ lead.last_name }} {{ lead.first_name }}</div>
        </div>

        <div class="form-row checkbox-row">
          <input type="checkbox" id="create-deal" class="checkbox" v-model="form.is_create_deal" />
          <label for="create-deal">Create a new Deal for this Account.</label>
        </div>

        <div class="form-row">
          <label>Owner of the new Account</label>
          <div class="select-owner">
            <select class="select-input" v-model="form.account_owner" required>
              <option value="3">Nhân Trần</option>
            </select>
          </div>
        </div>

        <div class="form-row checkbox-row">
          <input type="checkbox" id="notify-owner" class="checkbox" />
          <label for="notify-owner">Notify owner (Account and Contact).</label>
        </div>

        <div class="form-actions">
          <button class="convert-btn" @click="handleConvert">Convert</button>
          <button class="cancel-btn" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { leadRepository } from '@/services/repositories/lead'
import type { Lead, LeadConvertPayload } from '@/types/leads/lead'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const lead = ref<Lead>({} as Lead)
const toast = useToast()

const form = reactive({
  account_owner: '',
  is_create_deal: false,
})

const handleCancel = () => {
  router.go(-1)
}

const handleConvert = async () => {
  const payload: LeadConvertPayload = {
    account_owner: Number(form.account_owner.trim()) || lead.value.lead_owner?.id,
    is_create_deal: form.is_create_deal,
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

const fetchLeadDetails = async () => {
  try {
    const leadId = route.params.id as string
    const response = await leadRepository.index(leadId)
    console.log('✅ API Response:', response)
    lead.value = response
  } catch (error) {
    console.error('Error fetching lead details:', error)
  }
}

onMounted(() => {
  fetchLeadDetails()
})
</script>

<style>
.lead-convert-page {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  color: #333;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-title {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.lead-name {
  font-weight: normal;
  color: #666;
}

.convert-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  align-items: center;
}

.form-row label {
  width: 200px;
  font-weight: 500;
}

.tag {
  background-color: #e0e0e0;
  padding: 3px 5px;
  border-radius: 4px;
  font-size: 16px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-row label {
  width: auto;
  font-weight: normal;
}

.select-owner {
  position: relative;
  display: flex;
  align-items: end;
}

.select-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}

.convert-btn {
  background-color: #ff4d00;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #1a3353;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .form-row label {
    width: 100%;
  }

  .select-with-icon {
    width: 100%;
  }

  .select-input {
    width: 100%;
  }
}
</style>
