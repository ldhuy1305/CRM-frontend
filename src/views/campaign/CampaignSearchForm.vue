<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput
        label="Campaign Name"
        placeholder="Enter campaign name"
        v-model="form.campaignName"
      />

      <div class="select-with-clear">
        <CRMSelect
          label="Campaign Type"
          placeholder="Select campaign type"
          v-model="form.campaignType"
          :options="filteredCampaignTypeByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryCampaignType"
              placeholder="Search Campaign Type"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.campaignType" class="clear-icon" @click="clearCampaignType">X</span>
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Status"
          placeholder="Select status"
          v-model="form.status"
          :options="filteredStatusByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryStatus"
              placeholder="Search Status"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.status" class="clear-icon" @click="clearStatus">X</span>
      </div>

      <CRMInput type="date" label="Start Date" v-model="form.startDate" />

      <CRMInput type="date" label="End Date" v-model="form.endDate" />

      <div class="select-with-clear">
        <CRMSelect
          label="Campaign Owner"
          placeholder="Select campaign owner"
          v-model="form.campaignOwner"
          :options="filteredCampaignOwnerByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryCampaignOwner"
              placeholder="Search Campaign Owner"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.campaignOwner" class="clear-icon" @click="clearCampaignOwner">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import { campaignStatusRepository, campaignTypeRepository, userRepository } from '@/services'
import type { SelectOption } from '@/types/common/common_types'
import type { UserOption } from '@/types/users/user'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['search', 'clear'])

// Refs for options
const campaignTypeOptions = ref<SelectOption[]>([])
const statusOptions = ref<SelectOption[]>([])
const campaignOwnerOptions = ref<UserOption[]>([])
const isLoading = ref(false)

// Refs for search queries
const searchQueryCampaignType = ref('')
const searchQueryStatus = ref('')
const searchQueryCampaignOwner = ref('')

// Form data
const form = ref({
  campaignName: '',
  campaignType: '',
  status: '',
  startDate: '',
  endDate: '',
  campaignOwner: '',
})

// Fetch options for dropdowns
const fetchSelectOptions = async () => {
  try {
    isLoading.value = true
    const [typesRes, statusesRes, ownersRes] = await Promise.all([
      campaignTypeRepository.show(),
      campaignStatusRepository.show(),
      userRepository.show(),
    ])
    campaignTypeOptions.value = typesRes.results || typesRes
    statusOptions.value = statusesRes.results || statusesRes
    campaignOwnerOptions.value = ownersRes.results || ownersRes
  } catch (error) {
    console.error('Error fetching options:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties for filtered options
const filteredCampaignTypeByIdAndName = computed(() => {
  const trimmedQuery = searchQueryCampaignType.value.trim().toLowerCase()
  if (!trimmedQuery) return campaignTypeOptions.value

  return campaignTypeOptions.value.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery),
  )
})

const filteredStatusByIdAndName = computed(() => {
  const trimmedQuery = searchQueryStatus.value.trim().toLowerCase()
  if (!trimmedQuery) return statusOptions.value

  return statusOptions.value.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery),
  )
})

const filteredCampaignOwnerByIdAndName = computed(() => {
  const trimmedQuery = searchQueryCampaignOwner.value.trim().toLowerCase()

  if (!trimmedQuery) {
    return campaignOwnerOptions.value.map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
  }

  return campaignOwnerOptions.value
    .map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
    .filter((option) => `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery))
})

// Auto trim input values
watch(
  () => form.value,
  (newForm) => {
    ;(Object.keys(newForm) as Array<keyof typeof newForm>).forEach((key) => {
      if (typeof newForm[key] === 'string') {
        newForm[key] = (newForm[key] as string).trim()
      }
    })
  },
  { deep: true },
)

// Clear functions
function clearForm() {
  form.value = {
    campaignName: '',
    campaignType: '',
    status: '',
    startDate: '',
    endDate: '',
    campaignOwner: '',
  }

  searchQueryCampaignType.value = ''
  searchQueryStatus.value = ''
  searchQueryCampaignOwner.value = ''
  emit('clear')
}

function clearCampaignType() {
  form.value.campaignType = ''
  searchQueryCampaignType.value = ''
}

function clearStatus() {
  form.value.status = ''
  searchQueryStatus.value = ''
}

function clearCampaignOwner() {
  form.value.campaignOwner = ''
  searchQueryCampaignOwner.value = ''
}

// Search function
function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string } = {}

  if (data.campaignName?.trim()) output.name = data.campaignName.trim()
  if (data.campaignType) output.type = data.campaignType.toString()
  if (data.status) output.status = data.status.toString()
  if (data.startDate) output.start_date = data.startDate
  if (data.endDate) output.end_date = data.endDate
  if (data.campaignOwner) output.campaign_owner = data.campaignOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
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
