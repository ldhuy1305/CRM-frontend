<!-- <template>
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
import { ref, computed } from 'vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'

const emit = defineEmits(['search', 'clear'])

const form = ref({
  leadName: '',
  company: '',
  email: '',
  phone: '',
  leadSource: '',
  leadOwner: '',
})

const leadSourceOptions = [
  { id: 16, name: 'Trò chuyện' },
  { id: 15, name: 'Nghiên cứu trên Web' },
  { id: 14, name: 'Tải về từ Web' },
  { id: 13, name: 'Hội chợ' },
  { id: 12, name: 'Hội thảo nội bộ' },
  { id: 11, name: 'Hội thảo đối tác' },
  { id: 10, name: 'Quan hệ đối ngoại' },
  { id: 9, name: 'Quan hệ đối nội' },
  { id: 8, name: 'Đối tác' },
  { id: 7, name: 'Facebook' },
  { id: 6, name: 'X (Twitter)' },
  { id: 5, name: 'Cửa hàng trực tuyến' },
  { id: 4, name: 'Giới thiệu từ bên ngoài' },
  { id: 3, name: 'Giới thiệu từ nhân viên' },
  { id: 2, name: 'Gọi điện' },
  { id: 1, name: 'Quảng cáo' },
]

const leadOwnerOptions = [
  {
    id: 3,
    name: 'Nhan Tran',
    email: 'ttnhan2642@gmail.com',
    address: '54 Nguyen Luong Bang, Lien Chieu, Da Nang',
    phone: '0935614863',
  },
  {
    id: 2,
    name: 'Huy Lê Đức',
    email: 'ldhuydn1305@gmail.com',
    address: null,
    phone: null,
  },
  {
    id: 1,
    name: 'Admin',
    email: 'Admin001@gmail.com',
    address: '',
    phone: '',
  },
]

const searchQueryLeadSource = ref('')
const searchQueryLeadOwner = ref('')

const filteredLeadSourceByIdAndName = computed(() =>
  leadSourceOptions.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(searchQueryLeadSource.value.toLowerCase()),
  ),
)

const filteredLeadOwnerByIdAndName = computed(() =>
  leadOwnerOptions.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(searchQueryLeadOwner.value.toLowerCase()),
  ),
)

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

  const output: { [key: string]: string } = {}

  if (data.leadName) output.lead_name = data.leadName
  if (data.company) output.company = data.company
  if (data.email) output.email = data.email
  if (data.phone) output.phone = data.phone
  if (data.leadSource) output.lead_source = data.leadSource.toString()
  if (data.leadOwner) output.lead_owner = data.leadOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
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
</style> -->


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
import { ref, computed } from 'vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import CRMSelect from '@/components/ui/CRM-Select.vue'
import CRMButtonSearch from '@/components/ui/CRM-ButtonSearch.vue'

const emit = defineEmits(['search', 'clear'])

const form = ref({
  leadName: '',
  company: '',
  email: '',
  phone: '',
  leadSource: '',
  leadOwner: '',
})

const leadSourceOptions = [
  { id: 16, name: 'Trò chuyện' },
  { id: 15, name: 'Nghiên cứu trên Web' },
  { id: 14, name: 'Tải về từ Web' },
  { id: 13, name: 'Hội chợ' },
  { id: 12, name: 'Hội thảo nội bộ' },
  { id: 11, name: 'Hội thảo đối tác' },
  { id: 10, name: 'Quan hệ đối ngoại' },
  { id: 9, name: 'Quan hệ đối nội' },
  { id: 8, name: 'Đối tác' },
  { id: 7, name: 'Facebook' },
  { id: 6, name: 'X (Twitter)' },
  { id: 5, name: 'Cửa hàng trực tuyến' },
  { id: 4, name: 'Giới thiệu từ bên ngoài' },
  { id: 3, name: 'Giới thiệu từ nhân viên' },
  { id: 2, name: 'Gọi điện' },
  { id: 1, name: 'Quảng cáo' },
]

const leadOwnerOptions = [
  {
    id: 3,
    name: 'Nhan Tran',
    email: 'ttnhan2642@gmail.com',
    address: '54 Nguyen Luong Bang, Lien Chieu, Da Nang',
    phone: '0935614863',
  },
  {
    id: 2,
    name: 'Huy Lê Đức',
    email: 'ldhuydn1305@gmail.com',
    address: null,
    phone: null,
  },
  {
    id: 1,
    name: 'Admin',
    email: 'Admin001@gmail.com',
    address: '',
    phone: '',
  },
]

const searchQueryLeadSource = ref('')
const searchQueryLeadOwner = ref('')

const filteredLeadSourceByIdAndName = computed(() =>
  leadSourceOptions.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(searchQueryLeadSource.value.toLowerCase()),
  ),
)

const filteredLeadOwnerByIdAndName = computed(() =>
  leadOwnerOptions.filter((option) =>
    `${option.id} ${option.name}`.toLowerCase().includes(searchQueryLeadOwner.value.toLowerCase()),
  ),
)

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

  const output: { [key: string]: string } = {}

  if (data.leadName) output.lead_name = data.leadName
  if (data.company) output.company = data.company
  if (data.email) output.email = data.email
  if (data.phone) output.phone = data.phone
  if (data.leadSource) output.lead_source = data.leadSource.toString()
  if (data.leadOwner) output.lead_owner = data.leadOwner.toString()

  console.log('Search Payload:', JSON.stringify(output, null, 2))
  emit('search', output)
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
