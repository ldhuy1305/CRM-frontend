<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Title" placeholder="Enter meeting title" v-model="form.title" />

      <div class="select-with-clear">
        <CRMSelect
          label="Host"
          placeholder="Select host"
          v-model="form.host"
          :options="filteredHostByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryHost"
              placeholder="Search Host"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.host" class="clear-icon" @click="clearHost">X</span>
      </div>

      <div class="date-input-wrapper">
        <CRMInput
          type="date"
          label="Start Date"
          v-model="form.date"
          :placeholder="'dd/mm/yyyy'"
          :value="formatDateForInput(form.date)"
          @update:model-value="handleDateChange"
        />
      </div>

      <div class="select-with-clear">
        <CRMSelect
          label="Meeting Type"
          placeholder="Select type"
          v-model="form.type"
          :options="meetingTypeOptions"
          option-label="name"
          option-value="value"
        >
        </CRMSelect>
        <span v-if="form.type !== ''" class="clear-icon" @click="clearType">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import { userRepository } from '@/services'
import type { UserOption } from '@/types/users/user'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['search', 'clear'])

// Refs for options and queries
const hostOptions = ref<UserOption[]>([])
const isLoading = ref(false)
const searchQueryHost = ref('')

const meetingTypeOptions = [
  { id: 1, name: 'Online', value: 'true' },
  { id: 2, name: 'In Person', value: 'false' },
]

const form = ref({
  title: '',
  host: '',
  date: '',
  type: '',
})

const fetchHosts = async () => {
  try {
    isLoading.value = true
    const response = await userRepository.show()
    hostOptions.value = response.results || response
  } catch (error) {
    console.error('Error fetching hosts:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredHostByIdAndName = computed(() => {
  const trimmedQuery = searchQueryHost.value.trim().toLowerCase()

  if (!trimmedQuery) {
    return hostOptions.value.map((host) => ({
      id: host.id,
      name: `${host.first_name} ${host.last_name}`.trim(),
    }))
  }

  return hostOptions.value
    .map((host) => ({
      id: host.id,
      name: `${host.first_name} ${host.last_name}`.trim(),
    }))
    .filter((option) => `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery))
})

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
  form.value.date = value ? formatDateForDisplay(value) : ''
}

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

function clearForm() {
  form.value = {
    title: '',
    host: '',
    date: '',
    type: '',
  }
  searchQueryHost.value = ''
  emit('clear')
}

function clearHost() {
  form.value.host = ''
  searchQueryHost.value = ''
}

function clearType() {
  form.value.type = ''
}

function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string | boolean } = {}

  if (data.title?.trim()) output.title = data.title.trim()
  if (data.host) output.host = data.host.toString()
  if (data.date) output.start_time = formatDateForInput(data.date)
  if (data.type !== '') {
    if (String(data.type) === '1') {
      output.is_online = 'True'
    } else if (String(data.type) === '2') {
      output.is_online = 'False'
    }
  }

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

onMounted(() => {
  fetchHosts()
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
  grid-template-columns: repeat(4, 1fr);
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
