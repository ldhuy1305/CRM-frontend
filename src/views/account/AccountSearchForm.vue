<template>
    <div class="search-form">
      <div class="form-grid">
        <!-- Account Name -->
        <CRMInput label="Account Name" placeholder="Enter account name" v-model="form.accountName" />
        
        <!-- Phone -->
        <CRMInput label="Phone" placeholder="Enter phone number" v-model="form.phone" />
  
        <!-- Website -->
        <CRMInput label="Website" placeholder="Enter website" v-model="form.website" />
  
        <!-- Account Owner Select -->
        <div class="select-with-clear">
          <CRMSelect
            label="Account Owner"
            placeholder="Select account owner"
            v-model="form.accountOwner"
            :options="filteredAccountOwnerOptions"
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
          <span v-if="form.accountOwner" class="clear-icon" @click="form.accountOwner = ''">X</span>
        </div>
      </div>
  
      <!-- Button to search or clear -->
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
    accountName: '',
    phone: '',
    website: '',
    accountOwner: '',
  })
  
  const accountOwnerOptions = [
    { id: 3, name: 'Nhan Tran', email: 'ttnhan2642@gmail.com' },
    { id: 2, name: 'Huy Lê Đức', email: 'ldhuydn1305@gmail.com' },
    { id: 1, name: 'Admin', email: 'Admin001@gmail.com' },
  ]
  
  const searchQueryAccountOwner = ref('')
  
  const filteredAccountOwnerOptions = computed(() =>
    accountOwnerOptions.filter((option) =>
      `${option.id} ${option.name}`.toLowerCase().includes(searchQueryAccountOwner.value.toLowerCase()),
    ),
  )
  
  function onSearch() {
    const data = form.value
    const output: { [key: string]: string } = {}
  
    if (data.accountName) output.account_name = data.accountName
    if (data.phone) output.phone = data.phone
    if (data.website) output.website = data.website
    if (data.accountOwner) output.account_owner = data.accountOwner.toString()
  
    emit('search', output)
  }
  
  function onClear() {
    form.value = {
      accountName: '',
      phone: '',
      website: '',
      accountOwner: '',
    }
    searchQueryAccountOwner.value = ''
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
    grid-template-columns: repeat(4, 1fr);  /* Changed to 4 columns */
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
  