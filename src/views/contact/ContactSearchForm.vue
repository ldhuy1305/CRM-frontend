<template>
  <div class="search-form">
    <div class="form-grid">
      <CRMInput label="Contact Name" placeholder="Enter contact name" v-model="form.contactName" />
      <CRMInput label="Account ID" placeholder="Enter account ID" v-model="form.accountId" />
      <CRMInput label="Email" placeholder="Enter email" v-model="form.email" />
      <CRMInput label="Phone" placeholder="Enter phone number" v-model="form.phone" />

      <!-- Contact Owner Select -->
      <div class="select-with-clear">
        <CRMSelect
          label="Contact Owner"
          placeholder="Select contact owner"
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
        <span v-if="form.contactOwner" class="clear-icon" @click="form.contactOwner = ''">X</span>
      </div>
    </div>

    <CRMButtonSearch @clear="onClear" @search="onSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'

const emit = defineEmits(['search', 'clear'])

const form = ref({
  contactName: '',
  accountId: '',
  email: '',
  phone: '',
  contactOwner: '',
})

const contactOwnerOptions = [
  { id: 3, name: 'Nhan Tran', email: 'ttnhan2642@gmail.com' },
  { id: 2, name: 'Huy Lê Đức', email: 'ldhuydn1305@gmail.com' },
  { id: 1, name: 'Admin', email: 'Admin001@gmail.com' },
]

const searchQueryContactOwner = ref('')

const filteredContactOwnerOptions = computed(() =>
  contactOwnerOptions.filter((option) =>
    `${option.id} ${option.name}`
      .toLowerCase()
      .includes(searchQueryContactOwner.value.toLowerCase()),
  ),
)

function onSearch() {
  const data = form.value
  const output: { [key: string]: string } = {}

  if (data.contactName) output.contact_name = data.contactName
  if (data.accountId) output.account_id = data.accountId
  if (data.email) output.email = data.email
  if (data.phone) output.phone = data.phone
  if (data.contactOwner) output.contact_owner = data.contactOwner.toString()

  emit('search', output)
}

function onClear() {
  form.value = {
    contactName: '',
    accountId: '',
    email: '',
    phone: '',
    contactOwner: '',
  }
  searchQueryContactOwner.value = ''
  emit('clear')
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
  top: 67%;
  right: 28px;
  transform: translateY(-50%);
  cursor: pointer;
  font-weight: 700;
  color: #1a3353;
  font-size: 11px;
}
</style>
