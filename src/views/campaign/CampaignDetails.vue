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
            <div>{{ campaignLeads.length }} Leads</div>
            <div>{{ campaignContacts.length }} Contacts</div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">Expected Revenue</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat(campaign?.expected_revenue)) }}
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">Budgeted Cost</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat(campaign?.budgeted_cost)) }}
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">Actual Cost</div>
          <div class="stats-content">
            {{ formatVNDCurrency(parseFloat(campaign?.actual_cost)) }}
          </div>
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
      <!-- Leads Section - Fix the table display -->
      <div class="email-section">
        <div class="section-header">
          <h3>Leads ({{ campaignLeads.length }})</h3>
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
            <tr v-if="campaignLeads.length === 0">
              <td colspan="7" class="text-center">No leads assigned to this campaign</td>
            </tr>
            <tr v-for="lead in campaignLeads" :key="lead.id">
              <td>
                {{
                  lead.first_name && lead.last_name
                    ? `${lead.first_name} ${lead.last_name}`
                    : lead.name || 'N/A'
                }}
              </td>
              <td>{{ lead.company_name || lead.company || 'N/A' }}</td>
              <td>{{ lead.email || 'N/A' }}</td>
              <td>{{ lead.lead_source?.name || lead.lead_source || 'N/A' }}</td>
              <td>{{ lead.lead_status?.name || lead.lead_status || 'N/A' }}</td>
              <td>{{ lead.phone || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Contacts Section - Fix the table display -->
      <div class="email-section">
        <div class="section-header">
          <h3>Contacts ({{ campaignContacts.length }})</h3>
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
          <tbody>
            <tr v-if="campaignContacts.length === 0">
              <td colspan="5" class="text-center">No contacts assigned to this campaign</td>
            </tr>
            <tr v-for="contact in campaignContacts" :key="contact.id">
              <td>
                {{
                  contact.first_name && contact.last_name
                    ? `${contact.first_name} ${contact.last_name}`
                    : contact.name || 'N/A'
                }}
              </td>
              <td>{{ contact.email || 'N/A' }}</td>
              <td>{{ contact.phone || 'N/A' }}</td>
              <td>
                {{
                  contact.contact_owner
                    ? typeof contact.contact_owner === 'string'
                      ? contact.contact_owner
                      : `${contact.contact_owner.first_name} ${contact.contact_owner.last_name}`
                    : 'N/A'
                }}
              </td>
            </tr>
          </tbody>
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
import { campaignRepository, contactRepository, leadRepository } from '@/services'
import '@/styles/campaign/styles.css'
import type { Campaign } from '@/types/campaigns/campaign'
import type { NamedObject } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { Lead } from '@/types/leads/lead'
import type { UserOption } from '@/types/users/user'
import { formatDate, formatDateTime, formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const campaign = ref<Campaign>({} as Campaign)
const isLoading = ref(false)
const toast = useToast()

// Campaign target data
const campaignLeads = ref<Lead[]>([])
const campaignContacts = ref<Contact[]>([])
// const campaignDeals = ref<Deal[]>([])

// Available data for modals
const availableLeads = ref<Lead[]>([])
const availableContacts = ref<Contact[]>([])

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

// Fetch campaign targets
const fetchCampaignLeads = async () => {
  try {
    const response = await campaignRepository.getCampaignLeads(id)
    campaignLeads.value = response.results || []
  } catch (error) {
    console.error('Error fetching campaign leads:', error)
    campaignLeads.value = []
  }
}

const fetchCampaignContacts = async () => {
  try {
    const response = await campaignRepository.getCampaignContacts(id)
    campaignContacts.value = response.results || []
  } catch (error) {
    console.error('Error fetching campaign contacts:', error)
    campaignContacts.value = []
  }
}

const activeModal = ref<'leads' | 'deals' | 'contacts' | null>(null)

const leadColumns = [
  {
    key: 'lead_name',
    label: 'Lead Name',
    format: (value: string | undefined, lead: Lead) => {
      if (lead.first_name && lead.last_name) {
        return `${lead.first_name} ${lead.last_name}`
      } else if (lead.first_name) {
        return lead.first_name
      } else if (lead.last_name) {
        return lead.last_name
      }
      return 'N/A'
    },
  },
  {
    key: 'company',
    label: 'Company',
    format: (value: string | undefined, lead: Lead) => {
      return lead.company_name || 'N/A'
    },
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'phone',
    label: 'Phone',
  },
  { key: 'lead_source', label: 'Lead Source', format: (source: NamedObject) => source?.name },
  {
    key: 'lead_owner',
    label: 'Lead Owner',
    format: (owner: UserOption) => (owner ? `${owner.first_name} ${owner.last_name}` : '-'),
  },
]

const contactColumns = [
  {
    key: 'contact_name',
    label: 'Contact Name',
    format: (value: string | undefined, contact: Contact) => {
      if (contact.first_name && contact.last_name) {
        return `${contact.first_name} ${contact.last_name}`
      } else if (contact.first_name) {
        return contact.first_name
      } else if (contact.last_name) {
        return contact.last_name
      }
      return 'N/A'
    },
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'phone',
    label: 'Phone',
  },
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

const openContactModal = async () => {
  await fetchAvailableContacts()
  activeModal.value = 'contacts'
}

const closeModal = () => {
  activeModal.value = null
}

// Handle submissions - Fix the data extraction
const handleLeadsSubmit = async (selectedData: any) => {
  try {
    console.log('Selected Data:', selectedData)

    // Extract the actual array from the proxy object
    let leadIds: number[] = []

    if (Array.isArray(selectedData)) {
      leadIds = selectedData
    } else if (selectedData && typeof selectedData === 'object') {
      // Handle proxy object case
      if (selectedData[0] !== undefined) {
        // Convert proxy to array
        leadIds = Object.values(selectedData).filter((id) => typeof id === 'number') as number[]
      }
    }

    console.log('Processed Lead IDs:', leadIds)

    if (leadIds.length > 0) {
      for (const leadId of leadIds) {
        await campaignRepository.addLeadsToCampaign(id, leadId)
      }
      await fetchCampaignLeads()
      closeModal()
      toast.success('Leads added to campaign successfully!')
    } else {
      toast.error('No leads selected')
    }
  } catch (error) {
    console.error('Error adding leads to campaign:', error)
    toast.error('Failed to add leads to campaign.')
  }
}

const handleContactsSubmit = async (selectedData: any) => {
  try {
    console.log('Selected Data:', selectedData)

    // Extract the actual array from the proxy object
    let contactIds: number[] = []

    if (Array.isArray(selectedData)) {
      contactIds = selectedData
    } else if (selectedData && typeof selectedData === 'object') {
      // Handle proxy object case
      if (selectedData[0] !== undefined) {
        // Convert proxy to array
        contactIds = Object.values(selectedData).filter((id) => typeof id === 'number') as number[]
      }
    }

    console.log('Processed Contact IDs:', contactIds)

    if (contactIds.length > 0) {
      for (const contactId of contactIds) {
        await campaignRepository.addContactsToCampaign(id, contactId)
      }

      await fetchCampaignContacts()
      closeModal()
      toast.success('Contacts added to campaign successfully!')
    } else {
      toast.error('No contacts selected')
    }
  } catch (error) {
    console.error('Error adding contacts to campaign:', error)
    toast.error('Failed to add contacts to campaign.')
  }
}

const navigateToEditCampaign = (campaignId: number | undefined) => {
  if (campaignId) {
    router.push(`/campaigns/${campaignId}/edit/`)
  }
}

const navigateToAddLeadModal = () => openLeadModal()
const navigateToAddContactModal = () => openContactModal()

const handleDelete = async (campaignId: number | undefined) => {
  if (!campaignId) return
  try {
    const confirmed = confirm('Are you sure you want to delete this campaign?')
    if (confirmed) {
      await campaignRepository.destroy(campaignId)
      toast.success('Campaign deleted successfully!')
      router.push('/campaigns')
    }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    toast.error('Failed to delete campaign.')
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

onMounted(async () => {
  await fetchCampaign()
  await Promise.all([fetchCampaignLeads(), fetchCampaignContacts()])

  // Debug data structure
  debugLeadData()
  debugContactData()
})

// Debug the data structure - add this temporarily
const debugLeadData = () => {
  console.log('Campaign Leads:', campaignLeads.value)
  if (campaignLeads.value.length > 0) {
    console.log('First Lead:', campaignLeads.value[0])
  }
}

const debugContactData = () => {
  console.log('Campaign Contacts:', campaignContacts.value)
  if (campaignContacts.value.length > 0) {
    console.log('First Contact:', campaignContacts.value[0])
  }
}
</script>
