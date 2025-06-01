<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Account Name" placeholder="Enter account name" v-model="form.accountName" />
      <CRMInput label="Phone" placeholder="Enter phone number" v-model="form.phone" />
      <CRMInput label="Website" placeholder="Enter website" v-model="form.website" />

      <div class="select-with-clear">
        <CRMSelect
          label="Account Owner"
          placeholder="Select account owner"
          v-model="form.accountOwner"
          :options="filteredAccountOwnerByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryAccountOwner"
              placeholder="Search Account Owner"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.accountOwner" class="clear-icon" @click="clearAccountOwner">X</span>
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
const accountOwnerOptions = ref<UserOption[]>([])
const isLoading = ref(false)
const searchQueryAccountOwner = ref('')

const form = ref({
  accountName: '',
  phone: '',
  website: '',
  accountOwner: '',
})

const fetchSelectOptions = async () => {
  try {
    isLoading.value = true
    const ownersRes = await userRepository.show()
    accountOwnerOptions.value = ownersRes.results || ownersRes
  } catch (error) {
    console.error('Error fetching options:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredAccountOwnerByIdAndName = computed(() => {
  const trimmedQuery = searchQueryAccountOwner.value.trim().toLowerCase()

  if (!trimmedQuery) {
    return accountOwnerOptions.value.map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
  }

  return accountOwnerOptions.value
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

function clearForm() {
  form.value = {
    accountName: '',
    phone: '',
    website: '',
    accountOwner: '',
  }

  searchQueryAccountOwner.value = ''
  emit('clear')
}

function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string } = {}

  if (data.accountName?.trim()) output.name = data.accountName.trim()
  if (data.phone?.trim()) output.phone = data.phone.trim()
  if (data.website?.trim()) output.website = data.website.trim()
  if (data.accountOwner) output.account_owner = data.accountOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

function clearAccountOwner() {
  form.value.accountOwner = ''
  searchQueryAccountOwner.value = ''
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

.no-options {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 10px;
}
</style>
