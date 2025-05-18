<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="details-header">
      <div class="module-profile">
        <button class="icon-button btn-back" @click="router.back()">
          <span class="arrow-left"></span>
        </button>
        <div class="module-title">
          <h1>
            {{ campaign?.name }}
            <span class="period"
              >({{ formatDate(campaign?.start_date || undefined) }} -
              {{ formatDate(campaign?.end_date || undefined) }})</span
            >
          </h1>
          <div class="tag">
            <span>#{{ campaign?.id }}</span>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="navigateToEditCampaign(campaign?.id)">Edit</button>
        <button class="btn-primary" @click="handleDelete(campaign?.id)">Delete</button>
      </div>
    </div>
    <div class="content-section">
      <div class="stats-section">
        <div class="stats-card">
          <div class="stats-header">Total Count</div>
          <div class="stats-content">
            <div>0 Leads</div>
            <div>0 Contacts</div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">Actual Cost</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat(campaign?.actual_cost)) }}
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">Revenue</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat('0')) }}
          </div>
          <div class="stats-subtitle">From 0 Closed Deals</div>
        </div>

        <div class="stats-card">
          <div class="stats-header">In Pipeline</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat('0')) }}
          </div>
          <div class="stats-subtitle">From 0 Open Deals</div>
        </div>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h3>Details Information</h3>
        </div>

        <div class="section-content">
          <div class="info-grid">
            <div class="info-row">
              <label class="info-label">Campaign Owner</label>
              <div class="info-value">
                {{ campaign?.campaign_owner?.first_name }} {{ campaign?.campaign_owner?.last_name }}
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Type</label>
              <div class="info-value">{{ campaign?.campaign_type?.name }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Campaign Name</label>
              <div class="info-value">{{ campaign?.name }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Status</label>
              <div class="info-value">{{ campaign?.campaign_status?.name }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Start Date</label>
              <div class="info-value">{{ formatDate(campaign?.start_date ?? undefined) }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">End Date</label>
              <div class="info-value">{{ formatDate(campaign?.end_date ?? undefined) }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Expected Revenue</label>
              <div class="info-value">
                {{ formatVNDCurrency(parseFloat(campaign?.expected_revenue)) }}
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Budgeted Cost</label>
              <div class="info-value">
                {{ formatVNDCurrency(parseFloat(campaign?.budgeted_cost)) }}
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Actual Cost</label>
              <div class="info-value">
                {{ formatVNDCurrency(parseFloat(campaign?.actual_cost)) }}
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Expected Response</label>
              <div class="info-value">{{ campaign?.expected_response }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Numbers sent</label>
              <div class="info-value">{{ campaign?.numbers_sent }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Created By</label>
              <div class="info-value">
                {{ campaign?.created_by?.first_name }} {{ campaign?.created_by?.last_name }}
                <div class="timestamp">{{ formatDateTime(campaign?.created_at) }}</div>
              </div>
            </div>
            <div class="info-row">
              <label class="info-label"></label>
              <div class="info-value"></div>
            </div>
            <div class="info-row">
              <label class="info-label">Modified By</label>
              <div class="info-value" v-if="campaign.updated_by">
                {{ campaign?.updated_by?.first_name }} {{ campaign?.updated_by?.last_name }}
                <div class="timestamp">{{ formatDateTime(campaign?.updated_at) }}</div>
              </div>
              <div v-else></div>
            </div>
          </div>
          <h4 class="section-title">Description</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ campaign.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Lists Tabs -->
      <div class="email-section">
        <div class="section-header">
          <h3>Leads</h3>
          <div class="action-buttons">
            <button class="btn-primary" @click="navigateToAddLeadModal()">Add Leads</button>
          </div>
        </div>
        <table class="leads-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Lead Source</th>
              <th>Lead Status</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lead rows -->
          </tbody>
        </table>
      </div>
      <div class="email-section">
        <div class="section-header">
          <h3>Deals</h3>
          <div class="action-buttons">
            <button class="btn-tertiary" @click="navigateToAddDealModal()">Assign</button>
            <button class="btn-primary" @click="navigateToCreateDeal()">New Deal</button>
          </div>
        </div>
        <table class="deals-table">
          <thead>
            <tr>
              <th>Deal Name</th>
              <th>Amount</th>
              <th>Stage</th>
              <th>Probability (%)</th>
              <th>Closing Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <!-- Deal rows -->
          </tbody>
        </table>
      </div>

      <!-- Contacts Section -->
      <div class="email-section">
        <div class="section-header">
          <h3>Contacts</h3>
          <div class="action-buttons">
            <button class="btn-primary" @click="navigateToAddContactModal()">Add Contacts</button>
          </div>
        </div>
        <table class="contacts-table">
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Contact Owner</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Add modals -->
    <ModuleSelectionModal
      v-if="activeModal === 'leads'"
      :is-open="true"
      title="Leads"
      module-name="Lead"
      :columns="leadColumns"
      :items="availableLeads"
      :campaign-id="id"
      @close="closeModal"
      @submit="handleLeadsSubmit"
    />

    <ModuleSelectionModal
      v-if="activeModal === 'deals'"
      :is-open="true"
      title="Deals"
      module-name="Deal"
      :columns="dealColumns"
      :items="availableDeals"
      :campaign-id="id"
      @close="closeModal"
      @submit="handleDealsSubmit"
    />

    <ModuleSelectionModal
      v-if="activeModal === 'contacts'"
      :is-open="true"
      title="Contacts"
      module-name="Contact"
      :columns="contactColumns"
      :items="availableContacts"
      :campaign-id="id"
      @close="closeModal"
      @submit="handleContactsSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import ModuleSelectionModal from '@/components/modals/ModuleSelectionModal.vue'
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { campaignRepository, contactRepository, dealsRepository, leadRepository } from '@/services'
import '@/styles/campaign/styles.css'
import type { Campaign } from '@/types/campaigns/campaign'
import type { NamedObject } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { Deal, Stage } from '@/types/deals/deal'
import type { Lead } from '@/types/leads/lead'
import type { UserOption } from '@/types/users/user'
import { formatDate, formatDateTime, formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const campaign = ref<Campaign>({} as Campaign)
const isLoading = ref(false)

const fetchCampaign = async () => {
  try {
    isLoading.value = true
    const response = await campaignRepository.index(id)
    campaign.value = response.data || response
  } catch (error) {
    console.error('Error fetching campaign:', error)
  } finally {
    isLoading.value = false
  }
}

const activeModal = ref<'leads' | 'deals' | 'contacts' | null>(null)
const availableLeads = ref<Lead[]>([])
const availableDeals = ref<Deal[]>([])
const availableContacts = ref<Contact[]>([])

const leadColumns = [
  {
    key: 'lead_name',
    label: 'Lead Name',
    format: (lead: Lead) => `${lead?.first_name} ${lead?.last_name}`,
  },
  {
    key: 'company',
    label: 'Company',
    format: (lead: Lead) => `${lead?.company_name}`,
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'lead_source', label: 'Lead Source', format: (source: NamedObject) => source?.name },
  {
    key: 'lead_owner',
    label: 'Lead Owner',
    format: (owner: UserOption) => `${owner?.first_name} ${owner?.last_name}`,
  },
]

const dealColumns = [
  { key: 'name', label: 'Deal Name' },
  {
    key: 'amount',
    label: 'Amount',
    format: (value: string | number) => formatVNDCurrency(parseFloat(value as string)),
  },
  {
    key: 'stage',
    label: 'Stage',
    format: (stage: Stage) => stage?.name || '-',
  },
  {
    key: 'probability',
    label: 'Probability (%)',
    format: (value: number | null | undefined) => (value ? `${value}%` : '-'),
  },
  {
    key: 'closing_date',
    label: 'Closing Date',
    format: (date: string) => (date ? formatDate(date) : '-'),
  },
]

const contactColumns = [
  {
    key: 'contact_name',
    label: 'Contact Name',
    format: (contact: Contact) => `${contact?.first_name} ${contact?.last_name}`,
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'contact_owner',
    label: 'Contact Owner',
    format: (owner: UserOption) => (owner ? `${owner.first_name} ${owner.last_name}` : '-'),
  },
]

const openLeadModal = async () => {
  await fetchAvailableLeads()
  activeModal.value = 'leads'
}

const openDealModal = async () => {
  await fetchAvailableDeals()
  activeModal.value = 'deals'
}

const openContactModal = async () => {
  await fetchAvailableContacts()
  activeModal.value = 'contacts'
}

const closeModal = () => {
  activeModal.value = null
}

// Handle submissions
const handleLeadsSubmit = async (selectedIds: number[]) => {
  // Implement lead assignment logic
}

const handleDealsSubmit = async (selectedIds: number[]) => {
  // Implement deal assignment logic
}

const handleContactsSubmit = async (selectedIds: number[]) => {
  // Implement contact assignment logic
}

const navigateToEditCampaign = (campaignId: number | undefined) => {
  if (campaignId) {
    router.push(`/campaigns/${campaignId}/edit/`)
  }
}

const navigateToCreateDeal = () => {
  router.push('/deals/create/')
}

const navigateToAddLeadModal = () => openLeadModal()
const navigateToAddDealModal = () => openDealModal()
const navigateToAddContactModal = () => openContactModal()

const handleDelete = async (campaignId: number | undefined) => {
  if (!campaignId) return
  try {
    const confirmed = confirm('Are you sure you want to delete this campaign?')
    if (confirmed) {
      await campaignRepository.destroy(campaignId)
      alert('Campaign deleted successfully.')
      router.push('/campaigns')
    }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    alert('Failed to delete the campaign.')
  }
}

const fetchAvailableLeads = async () => {
  try {
    isLoading.value = true
    const response = await leadRepository.show()
    availableLeads.value = response.results
  } catch (error) {
    console.error('Error fetching available leads:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchAvailableDeals = async () => {
  try {
    isLoading.value = true
    const response = await dealsRepository.show()
    availableDeals.value = response.results.map((deal) => ({
      ...deal,
      closing_date: formatDate(deal.close_date)
        ? new Date(deal.close_date).toLocaleDateString()
        : null,
      probability: deal.probability,
    }))
  } catch (error) {
    console.error('Error fetching available deals:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchAvailableContacts = async () => {
  try {
    isLoading.value = true
    const response = await contactRepository.show()
    availableContacts.value = response.results
  } catch (error) {
    console.error('Error fetching available contacts:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCampaign()
})
</script>
