<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Contact Name" placeholder="Enter Contact Name" v-model="form.contactName" />
      <CRMInput label="Email" placeholder="Enter Email" v-model="form.email" />
      <CRMInput label="Phone" placeholder="Enter Phone number" v-model="form.phone" />

      <!-- Account Select -->
      <div class="select-with-clear">
        <CRMSelect
          label="Account"
          placeholder="Select Account"
          v-model="form.account"
          :options="filteredAccountOptions"
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

      <!-- Contact Owner Select -->
      <div class="select-with-clear">
        <CRMSelect
          label="Contact Owner"
          placeholder="Select Contact Owner"
          v-model="form.contactOwner"
          :options="filteredContactOwnerOptions"
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

    <CRMButtonSearch @clear="onClear" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import { accountRepository, userRepository } from '@/services'
import type { Account } from '@/types/accounts/account'
import type { UserOption } from '@/types/users/user'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['search', 'clear'])
const accountOptions = ref<Account[]>([])
const contactOwnerOptions = ref<UserOption[]>([])
const searchQueryAccount = ref('')
const searchQueryContactOwner = ref('')
const isLoading = ref(false)

const form = ref({
  contactName: '',
  account: '',
  email: '',
  phone: '',
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
    console.error('Error fetching dropdown data:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredAccountOptions = computed(() => {
  if (!searchQueryAccount.value) return accountOptions.value
  return accountOptions.value.filter((option) =>
    option.name.toLowerCase().includes(searchQueryAccount.value.toLowerCase().trim()),
  )
})

const filteredContactOwnerOptions = computed(() => {
  if (!searchQueryContactOwner.value) {
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
    .filter((option) =>
      option.name.toLowerCase().includes(searchQueryContactOwner.value.toLowerCase().trim()),
    )
})

function onSearch() {
  const data = { ...form.value }
  const output: { [key: string]: string } = {}

  if (data.contactName) output.first_name = data.contactName
  if (data.account) output.account_id = data.account
  if (data.email) output.email = data.email
  if (data.phone) output.phone = data.phone
  if (data.contactOwner) output.contact_owner = data.contactOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
}

function onClear() {
  form.value = {
    contactName: '',
    account: '',
    email: '',
    phone: '',
    contactOwner: '',
  }
  searchQueryContactOwner.value = ''
  searchQueryAccount.value = ''
  emit('clear')
}

function clearAccount() {
  form.value.account = ''
}

function clearContactOwner() {
  form.value.contactOwner = ''
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
</style>
