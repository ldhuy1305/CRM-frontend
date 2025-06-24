<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <div class="btn-back">
        <button class="icon-button" @click="handleBack">
          <i class="arrow-left"></i>
        </button>
      </div>
      <div class="module-profile">
        <div class="profile-image">
          <div class="avatar-placeholder">
            <img src="@/assets/default_avatar.png" alt="Lead Avatar" />
          </div>
        </div>
        <div class="module-title">
          <h1>
            {{ lead.first_name }} {{ lead.last_name }} -
            <span class="company-name">{{ lead.company_name }}</span>
          </h1>
          <div class="tag">
            <span>#{{ lead.id }}</span>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button
          class="btn-primary"
          @click="sendEmail"
          :disabled="!lead.email"
          :title="lead.email ? `Send email to ${lead.email}` : 'No email address available'"
        >
          <i class="fas fa-envelope"></i>
          Send mail
        </button>
        <button class="btn-tertiary" @click="navigateToConvertLead(lead.id)">Convert</button>
        <button class="btn-secondary" @click="navigateToEditLead(lead.id)">Edit</button>
      </div>
    </div>

    <div class="content-section">
      <div class="summary-card">
        <div class="info-row">
          <div class="info-label">Lead Owner</div>
          <div class="info-value">
            {{ lead.lead_owner?.last_name }} {{ lead.lead_owner?.first_name }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Email</div>
          <div class="info-value">{{ lead.email }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone</div>
          <div class="info-value">{{ lead.phone }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Lead Status</div>
          <div class="info-value">{{ lead.lead_status?.name || '-' }}</div>
        </div>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h3>Details Information</h3>
        </div>

        <div class="section-content">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Lead Owner</div>
              <div class="info-value">
                {{ lead.lead_owner?.last_name }} {{ lead.lead_owner?.first_name }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Company</div>
              <div class="info-value">{{ lead.company_name }}</div>
            </div>
            <!-- <div class="info-row">
              <div class="info-label">Title</div>
              <div class="info-value">{{ lead. || '-' }}</div>
            </div> -->
            <div class="info-row">
              <div class="info-label">Lead Name</div>
              <div class="info-value">
                {{ lead?.first_name || '-' }} {{ lead?.last_name || '-' }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">{{ lead.phone }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">{{ lead.email }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lead Source</div>
              <div class="info-value">{{ lead.lead_source?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Fax</div>
              <div class="info-value">{{ lead.fax || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Industry</div>
              <div class="info-value">{{ lead.industry?.name }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Website</div>
              <div class="info-value">{{ lead.website || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Annual Revenue</div>
              <div class="info-value">
                {{ formatVNDCurrency(parseFloat(lead.annual_revenue)) }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Lead Status</div>
              <div class="info-value">{{ lead.lead_status?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Created By</div>
              <div class="info-value">
                {{ lead.created_by?.first_name }} {{ lead.created_by?.last_name }}<br />
                <span class="timestamp">{{ new Date(lead.created_at).toLocaleString() }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">No of Employees</div>
              <div class="info-value"></div>
            </div>
            <div class="info-row">
              <div class="info-label">Rating</div>
              <div class="info-value"></div>
            </div>
          </div>

          <h4 class="section-title">Address Information</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Street</div>
              <div class="info-value">{{ lead.street || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">City</div>
              <div class="info-value">{{ lead.city || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Province</div>
              <div class="info-value">{{ lead.state_province || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Postal Code</div>
              <div class="info-value">{{ lead.postal_code || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Country</div>
              <div class="info-value">{{ lead.country || '-' }}</div>
            </div>
          </div>

          <h4 class="section-title">Description</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ lead.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { leadRepository } from '@/services/repositories/lead'
import '@/styles/shared/index.css'
import type { Lead } from '@/types/leads/lead'
import { formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const lead = ref<Lead>({} as Lead)
const isLoading = ref(false)

const handleBack = () => {
  // // Check if we can go back in history
  // if (window.history.state?.back || document.referrer.includes('/leads')) {
  //   router.back()
  // } else {
  // Fallback to leads list if no history
  router.back()
  // }
}

const navigateToConvertLead = (leadId: number) => {
  router.push(`/leads/${leadId}/convert`)
}

const navigateToEditLead = (leadId: number) => {
  router.push(`/leads/${leadId}/edit`)
}

const userName = computed(() => {
  if (authStore.user) {
    return `${authStore?.user.user.first_name} ${authStore?.user.user.last_name}`.trim()
  }
  return 'Unibeam CRM Leads'
})

const sendEmail = () => {
  if (!lead.value.email) {
    console.warn('No email address available for this lead')
    return
  }

  // Create the mailto link with pre-filled subject and body
  const fullName = `${lead.value.first_name} ${lead.value.last_name}`.trim()
  const subject = encodeURIComponent(
    `[Unibeam CRM] Regarding: ${fullName} - ${lead.value.company_name}`,
  )
  const body = encodeURIComponent(
    `Dear Mr/Mrs. ${fullName},\n\nI hope this email finds you well.\n\n\nBest regards,\n\n${userName.value} - Unibeam CRM`,
  )

  const mailtoLink = `mailto:${lead.value.email}?subject=${subject}&body=${body}`

  // Open the default email client
  window.location.href = mailtoLink
}

const fetchLeadDetails = async () => {
  try {
    isLoading.value = true
    const leadId = route.params.id as string
    const response = await leadRepository.index(leadId)
    console.log('✅ API Response:', response)
    lead.value = response.data || response
  } catch (error) {
    console.error('Error fetching lead details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLeadDetails()
})
</script>

<style scoped>
/* Add some styling for the disabled state */
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary:disabled:hover {
  transform: none;
  box-shadow: none;
}
</style>
