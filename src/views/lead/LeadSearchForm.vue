
<template>
  <div class="search-form">
    <h2>List of accounts</h2>

    <div class="form-grid">
      <CRMInput
        label="Account Name"
        placeholder="Enter account name"
        v-model="form.accountName"
      />

      <CRMInput
        label="Phone"
        placeholder="Enter phone number"
        v-model="form.phone"
      />

      <CRMInput
        label="Website"
        placeholder="Enter website"
        v-model="form.website"
      />

      <CRMInput
        label="Lead Owner"
        placeholder="Enter lead owner"
        v-model="form.leadOwner"
      />

      <CRMDatePicker
        label="Date of Birth"
        v-model="form.diagnosisDate"
      />

      <CRMDatePicker
        label="Account Application Date"
        v-model="form.applicationDate"
      />

      <CRMSelect
        label="Status"
        v-model="form.status"
        :options="statusOptions"
        placeholder="Select status"
      />
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import CRMDatePicker from '@/components/ui/CRM-DatePicker.vue'
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'

const form = ref({
  accountName: '',
  phone: '',
  website: '',
  leadOwner: '',
  diagnosisDate: '',
  applicationDate: '',
  status: ''
})

const statusOptions = [
  { label: 'Approved and Corrected', value: 'approved_corrected' },
  { label: 'Not Approved', value: 'not_approved' },
  { label: 'Approved', value: 'approved' }
]

const emit = defineEmits(['search', 'clear'])

function clearForm() {
  form.value = {
    accountName: '',
    phone: '',
    website: '',
    leadOwner: '',
    diagnosisDate: '',
    applicationDate: '',
    status: ''
  }
  emit('clear')
}

function onSearch() {
  emit('search', { ...form.value })
}
</script>

<style scoped>
.search-form {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.button-group {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-clear {
  padding: 8px 16px;
  border: 1px solid #00a67e;
  color: #00a67e;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.btn-search {
  padding: 8px 16px;
  border: none;
  background: #00a67e;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
