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
          :options="filteredLeadSourceByIdAndName"
          option-label="name"
          option-value="id"
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
          :options="filteredLeadOwnerByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryLeadOwner"
              placeholder="Search Lead Owner"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.leadOwner" class="clear-icon" @click="clearLeadOwner">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import { leadSourceRepository, userRepository } from '@/services'
import type { SelectOption } from '@/types/common/common_types'
import type { UserOption } from '@/types/users/user'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['search', 'clear'])
const leadOwnerOptions = ref<UserOption[]>([])
const leadSourceOptions = ref<SelectOption[]>([])
const isLoading = ref(false)
const searchQueryLeadSource = ref('')
const searchQueryLeadOwner = ref('')

const form = ref({
  leadName: '',
  company: '',
  email: '',
  phone: '',
  leadSource: '',
  leadOwner: '',
})

const fetchSelectOptions = async () => {
  try {
    isLoading.value = true
    const [sourcesRes, ownersRes] = await Promise.all([
      leadSourceRepository.show(),
      userRepository.show(),
    ])
    leadSourceOptions.value = sourcesRes.results || sourcesRes
    leadOwnerOptions.value = ownersRes.results || ownersRes
  } catch (error) {
    console.error('Error fetching options:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredLeadSourceByIdAndName = computed(() =>
  leadSourceOptions.value.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(searchQueryLeadSource.value.toLowerCase()),
  ),
)

const filteredLeadOwnerByIdAndName = computed(() => {
  if (!searchQueryLeadOwner.value)
    return leadOwnerOptions.value.map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))

  return leadOwnerOptions.value
    .map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
    .filter((option) =>
      `${option.id} ${option.name}`
        .toLowerCase()
        .includes(searchQueryLeadOwner.value.toLowerCase().trim()),
    )
})

function clearForm() {
  form.value = {
    leadName: '',
    company: '',
    email: '',
    phone: '',
    leadSource: '',
    leadOwner: '',
  }

  searchQueryLeadSource.value = ''
  searchQueryLeadOwner.value = ''
  emit('clear')
}

function onSearch() {
  const data = { ...form.value }

  const output: { [key: string]: string } = {}

  if (data.leadName) output.first_name = data.leadName
  if (data.company) output.company = data.company
  if (data.email) output.email = data.email
  if (data.phone) output.phone = data.phone
  if (data.leadSource) output.source = data.leadSource.toString()
  if (data.leadOwner) output.owner = data.leadOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

function clearLeadSource() {
  form.value.leadSource = ''
  searchQueryLeadSource.value = ''
}

function clearLeadOwner() {
  form.value.leadOwner = ''
  searchQueryLeadOwner.value = ''
}

onMounted(() => {
  fetchSelectOptions()
})
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
  top: 67%;
  right: 28px;
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
