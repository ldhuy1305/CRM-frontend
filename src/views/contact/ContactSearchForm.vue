<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Contact Name" placeholder="Enter contact name" v-model="form.contactName" />
      <CRMInput label="Email" placeholder="Enter email" v-model="form.email" />
      <CRMInput label="Phone" placeholder="Enter phone number" v-model="form.phone" />

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
          label="Contact Owner"
          placeholder="Select contact owner"
          v-model="form.contactOwner"
          :options="filteredContactOwnerByIdAndName"
          option-label="name"
          option-value="id"
        >
          <template #default>
            <input
              type="text"
              v-model="searchQueryContactOwner"
              placeholder="Search Contact Owner"
              class="search-input"
            />
          </template>
        </CRMSelect>
        <span v-if="form.contactOwner" class="clear-icon" @click="clearContactOwner">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="clearForm" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import { accountRepository, userRepository } from '@/services'
import type { Account } from '@/types/accounts/account'
import type { UserOption } from '@/types/users/user'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['search', 'clear'])
const accountOptions = ref<Account[]>([])
const contactOwnerOptions = ref<UserOption[]>([])
const isLoading = ref(false)
const searchQueryAccount = ref('')
const searchQueryContactOwner = ref('')

const form = ref({
  contactName: '',
  email: '',
  phone: '',
  account: '',
  contactOwner: '',
})

const fetchSelectOptions = async () => {
  try {
    isLoading.value = true
    const [accountsRes, ownersRes] = await Promise.all([
      accountRepository.show(),
      userRepository.show(),
    ])
    accountOptions.value = accountsRes.results || accountsRes
    contactOwnerOptions.value = ownersRes.results || ownersRes
  } catch (error) {
    console.error('Error fetching options:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredAccountByIdAndName = computed(() => {
  const trimmedQuery = searchQueryAccount.value.trim().toLowerCase()
  if (!trimmedQuery) return accountOptions.value

  return accountOptions.value.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery),
  )
})

const filteredContactOwnerByIdAndName = computed(() => {
  const trimmedQuery = searchQueryContactOwner.value.trim().toLowerCase()

  if (!trimmedQuery) {
    return contactOwnerOptions.value.map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
  }

  return contactOwnerOptions.value
    .map((owner) => ({
      id: owner.id,
      name: `${owner.first_name} ${owner.last_name}`.trim(),
    }))
    .filter((option) => `${option.id} ${option.name}`.toLowerCase().includes(trimmedQuery))
})

watch(
  () => form.value,
  (newForm) => {
    ;(Object.keys(newForm) as Array<keyof typeof newForm>).forEach((key) => {
      if (typeof newForm[key] === 'string') {
        newForm[key] = newForm[key].trim()
      }
    })
  },
  { deep: true },
)

function clearForm() {
  form.value = {
    contactName: '',
    email: '',
    phone: '',
    account: '',
    contactOwner: '',
  }

  searchQueryAccount.value = ''
  searchQueryContactOwner.value = ''
  emit('clear')
}

function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string } = {}

  if (data.contactName?.trim()) {
    const trimmedName = data.contactName.trim()
    output.first_name = trimmedName
  }
  if (data.email?.trim()) output.email = data.email.trim()
  if (data.phone?.trim()) output.phone = data.phone.trim()
  if (data.account) output.account = data.account.toString()
  if (data.contactOwner) output.contact_owner = data.contactOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

function clearAccount() {
  form.value.account = ''
  searchQueryAccount.value = ''
}

function clearContactOwner() {
  form.value.contactOwner = ''
  searchQueryContactOwner.value = ''
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
