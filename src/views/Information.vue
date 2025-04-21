<template>
  <div class="information-section">
    <h2>Information</h2>
    <AvatarSection />

    <div class="form-grid">
      <FormGroup v-model="form.firstName" label="First Name" type="text" />
      <FormGroup v-model="form.lastName" label="Last Name" type="text" />
      <FormGroup v-model="form.company" label="Company" type="text" />
      <FormGroup
        v-model="form.leadOwner"
        label="Lead Owner"
        type="select"
        :options="leadOwners"
        defaultOption="Select Owner"
      />
      <FormGroup v-model="form.email" label="Email" type="email" />
      <FormGroup v-model="form.phone" label="Phone" type="tel" />
      <FormGroup v-model="form.website" label="Website" type="url" />
      <FormGroup v-model="form.fax" label="Fax" type="tel" />
      <FormGroup
        v-model="form.leadSource"
        label="Lead Source"
        type="select"
        :options="leadSources"
        defaultOption="Select Source"
      />
      <FormGroup
        v-model="form.leadStatus"
        label="Lead Status"
        type="select"
        :options="leadStatuses"
        defaultOption="Select Status"
      />
      <FormGroup
        v-model="form.industry"
        label="Industry"
        type="select"
        :options="industries"
        defaultOption="Select Industry"
      />
      <FormGroup v-model="form.annualRevenue" label="Annual Revenue" type="number" />
      <FormGroup v-model="form.callOptOut" label="Call Opt Out" type="checkbox" />
      <FormGroup v-model="form.emailOptOut" label="Email Opt Out" type="checkbox" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import AvatarSection from './AvatarSection.vue'
import FormGroup from './FormGroup.vue'

const props = defineProps({
  form: {
    type: Object as PropType<{
      firstName: string
      lastName: string
      company: string
      leadOwner: string
      email: string
      phone: string
      website: string
      fax: string
      leadSource: string
      leadStatus: string
      industry: string
      annualRevenue: number
      callOptOut: boolean
      emailOptOut: boolean
    }>,
    required: true,
  },
})

const leadOwners = [
  { value: 'sally', text: 'Sally Tran' },
  { value: 'brown', text: 'Brown Tran' },
]

const leadSources = [
  { value: 'website', text: 'Website' },
  { value: 'facebook', text: 'Facebook' },
  { value: 'zalo', text: 'Zalo' },
]

const leadStatuses = [
  { value: 'new', text: 'New' },
  { value: 'contacted', text: 'Contacted' },
  { value: 'qualified', text: 'Qualified' },
]

const industries = [
  { value: 'technology', text: 'Technology' },
  { value: 'finance', text: 'Finance' },
  { value: 'healthcare', text: 'Healthcare' },
]
</script>

<style scoped>
.information-section {
  margin-bottom: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>
