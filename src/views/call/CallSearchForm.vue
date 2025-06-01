<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Title" placeholder="Enter call title" v-model="form.title" />

      <div class="select-with-clear">
        <CRMSelect
          label="Call Type"
          placeholder="Select call type"
          v-model="form.callType"
          :options="filteredCallTypeByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryCallType"
              placeholder="Search Call Type"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.callType" class="clear-icon" @click="clearCallType">X</span>
      </div>

      <div class="date-input-wrapper">
        <CRMInput
          type="date"
          label="Start Time"
          v-model="form.startTime"
          :placeholder="'dd/mm/yyyy'"
          :value="formatDateForInput(form.startTime)"
          @update:model-value="handleDateChange"
        />
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Account"
          placeholder="Select account"
          v-model="form.account"
          :options="filteredAccountByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryAccount"
              placeholder="Search Account"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.account" class="clear-icon" @click="clearAccount">X</span>
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Contact"
          placeholder="Select contact"
          v-model="form.contact"
          :options="filteredContactByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryContact"
              placeholder="Search Contact"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.contact" class="clear-icon" @click="clearContact">X</span>
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Call Owner"
          placeholder="Select owner"
          v-model="form.owner"
          :options="filteredOwnerByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryOwner"
              placeholder="Search Owner"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.owner" class="clear-icon" @click="clearOwner">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import {
  accountRepository,
  callTypeRepository,
  contactRepository,
  userRepository,
} from '@/services'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['search', 'clear'])

// Refs for options
interface NamedObject {
  id: string | number
  name?: string
  first_name?: string
  last_name?: string
  [key: string]: any
}
const callTypeOptions = ref<NamedObject[]>([])
const accountOptions = ref<NamedObject[]>([])
const contactOptions = ref<NamedObject[]>([])
const ownerOptions = ref<NamedObject[]>([])
const isLoading = ref(false)

// Search query refs
const searchQueryCallType = ref('')
const searchQueryAccount = ref('')
const searchQueryContact = ref('')
const searchQueryOwner = ref('')

const form = ref({
  title: '',
  callType: '',
  startTime: '',
  account: '',
  contact: '',
  owner: '',
})

// Fetch all options
const fetchSelectOptions = async () => {
  try {
    isLoading.value = true
    const [callTypesRes, accountsRes, contactsRes, ownersRes] = await Promise.all([
      callTypeRepository.show(),
      accountRepository.show(),
      contactRepository.show(),
      userRepository.show(),
    ])

    callTypeOptions.value = callTypesRes.results || callTypesRes
    accountOptions.value = accountsRes.results || accountsRes
    contactOptions.value = contactsRes.results || contactsRes
    ownerOptions.value = ownersRes.results || ownersRes
  } catch (error) {
    console.error('Error fetching options:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties for filtered options
const filteredCallTypeByIdAndName = computed(() => {
  const trimmedQuery = searchQueryCallType.value.trim().toLowerCase()
  const normalized = (arr: NamedObject[]) =>
    arr
      .filter((option) => option.id !== undefined && option.name !== undefined)
      .map((option) => ({
        id: Number(option.id),
        name: String(option.name),
      }))
  if (!trimmedQuery) return normalized(callTypeOptions.value)
  return normalized(
    callTypeOptions.value.filter((option) =>
      `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery),
    ),
  )
})

const filteredAccountByIdAndName = computed(() => {
  const trimmedQuery = searchQueryAccount.value.trim().toLowerCase()
  const normalized = (arr: NamedObject[]) =>
    arr
      .filter((option) => option.id !== undefined && option.name !== undefined)
      .map((option) => ({
        id: Number(option.id),
        name: String(option.name),
      }))
  if (!trimmedQuery) return normalized(accountOptions.value)
  return normalized(
    accountOptions.value.filter((option) =>
      `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery),
    ),
  )
})

const filteredContactByIdAndName = computed(() => {
  const trimmedQuery = searchQueryContact.value.trim().toLowerCase()
  if (!trimmedQuery)
    return contactOptions.value.map((contact) => ({
      id: Number(contact.id),
      name: `${contact.last_name} ${contact.first_name}`.trim(),
    }))
  return contactOptions.value
    .map((contact) => ({
      id: Number(contact.id),
      name: `${contact.last_name} ${contact.first_name}`.trim(),
    }))
    .filter((option) => `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery))
})

const filteredOwnerByIdAndName = computed(() => {
  const trimmedQuery = searchQueryOwner.value.trim().toLowerCase()
  if (!trimmedQuery)
    return ownerOptions.value.map((owner) => ({
      id: Number(owner.id),
      name: `${owner.last_name} ${owner.first_name}`.trim(),
    }))
  return ownerOptions.value
    .map((owner) => ({
      id: Number(owner.id),
      name: `${owner.last_name} ${owner.first_name}`.trim(),
    }))
    .filter((option) => `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery))
})

// Date formatting functions
function formatDateForInput(date: string) {
  if (!date) return ''
  return date.split('/').reverse().join('-')
}

function formatDateForDisplay(date: string) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

function handleDateChange(value: string) {
  form.value.startTime = value ? formatDateForDisplay(value) : ''
}

// Clear functions
function clearForm() {
  form.value = {
    title: '',
    callType: '',
    startTime: '',
    account: '',
    contact: '',
    owner: '',
  }
  searchQueryCallType.value = ''
  searchQueryAccount.value = ''
  searchQueryContact.value = ''
  searchQueryOwner.value = ''
  emit('clear')
}

function clearCallType() {
  form.value.callType = ''
  searchQueryCallType.value = ''
}

function clearAccount() {
  form.value.account = ''
  searchQueryAccount.value = ''
}

function clearContact() {
  form.value.contact = ''
  searchQueryContact.value = ''
}

function clearOwner() {
  form.value.owner = ''
  searchQueryOwner.value = ''
}

// Search function
function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string } = {}

  if (data.title?.trim()) output.title = data.title.trim()
  if (data.callType) output.type = data.callType.toString()
  if (data.startTime) output.start_time = formatDateForInput(data.startTime)
  if (data.account) output.account = data.account.toString()
  if (data.contact) output.contact = data.contact.toString()
  if (data.owner) output.owner = data.owner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

// Watch for input trimming
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

.date-input-wrapper :deep(input[type='date']) {
  height: 38px;
}

.date-input-wrapper :deep(input[type='date']::-webkit-calendar-picker-indicator) {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>
