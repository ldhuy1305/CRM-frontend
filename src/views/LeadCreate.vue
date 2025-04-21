<template>
  <div class="create-lead-container">
    <LeadHeader @cancel="handleCancel" />
    <div class="form-container">
      <Information :form="form" />
      <Address :form="form" />
      <Description :form="form" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import LeadHeader from './LeadHeader.vue'
import Information from './Information.vue'
import Address from './Address.vue'
import Description from './Description.vue'

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  company: '',
  leadOwner: '',
  email: '',
  phone: '',
  website: '',
  fax: '',
  leadSource: '',
  leadStatus: '',
  industry: '',
  annualRevenue: 0,
  callOptOut: false,
  emailOptOut: false,
  street: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  description: '',
})

const handleCancel = () => {
  router.push('/leads')
}
</script>
