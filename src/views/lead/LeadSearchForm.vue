<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Lead Name" placeholder="Enter lead name" v-model="form.leadName" />
      <CRMInput label="Company" placeholder="Enter company name" v-model="form.company" />
      <CRMInput label="Email" placeholder="Enter email" v-model="form.email" />
      <CRMInput label="Phone" placeholder="Enter phone number" v-model="form.phone" />

      <div class="select-with-clear">
        <CRMSelect
          label="Lead Source"
          placeholder="Select lead source"
          v-model="form.leadSource"
          :options="filteredLeadSourceOptions"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryLeadSource"
              placeholder="Search Lead Source"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.leadSource" class="clear-icon" @click="clearLeadSource">X</span>
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Lead Owner"
          placeholder="Select lead owner"
          v-model="form.leadOwner"
          :options="filteredLeadOwnerOptions"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryLeadOwner"
              placeholder="Search Lead Owner"
              class="search-input"
            />
            <div v-if="form.leadOwner === ''" class="no-options">No options</div>
          </template>
        </CRMSelect>
        <span v-if="form.leadOwner" class="clear-icon" @click="clearLeadOwner">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
const leadSourceSelectionCount = ref(0);

const form = ref({
  leadName: '',
  company: '',
  email: '',
  phone: '',
  leadSource: '',
  leadOwner: '',
})

const leadSourceOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Hội thảo đối tác', value: 'referral' },
  { label: 'Giới thiệu từ nhân viên', value: 'staff' },
  { label: 'Gọi điện', value: 'admin' },
]

const leadOwnerOptions = [
  { label: 'Nhan Tran', value: 'Nhan Tran' },
  { label: 'Tran Nhan', value: 'Tran Nhan' },
  { label: 'Le Duc Huy', value: 'Le Duc Duy' },
  { label: 'Admin', value: 'Admin' },
]

const searchQueryLeadSource = ref('')
const searchQueryLeadOwner = ref('')

const filteredLeadSourceOptions = computed(() => {
  return leadSourceOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQueryLeadSource.value.toLowerCase()),
  )
})

const filteredLeadOwnerOptions = computed(() => {
  return leadOwnerOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQueryLeadOwner.value.toLowerCase()),
  )
})

const emit = defineEmits(['search', 'clear'])

function clearForm() {
  form.value = {
    leadName: '',
    company: '',
    email: '',
    phone: '',
    leadSource: '',
    leadOwner: '',
  }
  emit('clear')
}

function onSearch() {
  const data = { ...form.value }

  
  const output: { [key: string]: string | number } = {}

  
  if (data.leadName) {
    output.lead_name = data.leadName
  }

  if (data.company) {
    output.company = data.company
  }

  if (data.email) {
    output.email = data.email
  }

  if (data.phone) {
    output.phone = data.phone
  }

 
  if (data.leadSource) {
    const selectedLeadSource = leadSourceOptions.find(opt => opt.value === data.leadSource)
    if (selectedLeadSource) {
      
      if (selectedLeadSource.value === 'admin') {
        leadSourceSelectionCount.value++
      }
      
      output.lead_source = leadSourceSelectionCount.value === 0 ? selectedLeadSource.value : leadSourceSelectionCount.value
    }
  }

  
  if (data.leadOwner) {
    const selectedLeadOwner = leadOwnerOptions.find(opt => opt.value === data.leadOwner)
    if (selectedLeadOwner) {
      output.lead_owner = selectedLeadOwner.value
    }
  }


  console.log(JSON.stringify(output, null, 2)) 

  emit('search', data)
}

function clearLeadSource() {
  form.value.leadSource = ''
}

function clearLeadOwner() {
  form.value.leadOwner = ''
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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.select-with-clear {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.clear-icon {
  position: absolute;
  top: 66%;
  right: 36px;
  transform: translateY(-50%);
  cursor: pointer;
  font-weight: 700;
  color: #1a3353;
  font-size: 11px;
}

.no-options {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 10px;
}
</style>
