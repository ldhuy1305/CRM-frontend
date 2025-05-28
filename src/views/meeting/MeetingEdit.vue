<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Edit Meeting</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Meeting Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Title<span class="mandatory">*</span></label>
            <input
              type="text"
              v-model="form.title"
              :class="{ 'input-error': errors.title }"
              placeholder="Enter meeting title"
            />
            <span class="error-message">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" v-model="form.location" placeholder="Enter location" />
          </div>

          <div class="form-group">
            <label>Host<span class="mandatory">*</span></label>
            <select v-model="form.host" :class="{ 'input-error': errors.host }">
              <option value="null"></option>
              <option v-for="owner in meetingHosts" :key="owner.id" :value="owner.id">
                {{ owner.first_name }} {{ owner.last_name }}
              </option>
            </select>
            <span class="error-message">{{ errors.host }}</span>
          </div>
          <div class="form-group">
            <label>Related To</label>
            <select v-model="related_to">
              <option value="">None</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="account">Account</option>
              <option value="deal">Deal</option>
              <option value="campaign">Campaign</option>
            </select>
          </div>
          <div class="form-group" v-if="related_to != ''"></div>
          <div class="form-group" v-if="related_to === 'lead'">
            <label>Lead</label>
            <select v-model="form.related_lead">
              <option :value="null">Select Lead</option>
              <option v-for="lead in leads" :key="lead.id" :value="lead.id">
                {{ lead.first_name }} {{ lead.last_name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="related_to === 'contact'">
            <label>Contact</label>
            <select v-model="form.related_contact">
              <option :value="null">Select Contact</option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.first_name }} {{ contact.last_name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="related_to === 'account'">
            <label>Account</label>
            <select v-model="form.related_account">
              <option :value="null">Select Account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="related_to === 'deal'">
            <label>Deal</label>
            <select v-model="form.related_deal">
              <option :value="null">Select Deal</option>
              <option v-for="deal in deals" :key="deal.id" :value="deal.id">
                {{ deal.name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="related_to === 'campaign'">
            <label>Campaign</label>
            <select v-model="form.related_campaign">
              <option :value="null">Select Campaign</option>
              <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                {{ campaign.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>From<span class="mandatory">*</span></label>
            <input
              type="datetime-local"
              v-model="form.from_datetime"
              :class="{ 'input-error': errors.from_datetime }"
            />
            <span class="error-message">{{ errors.from_datetime }}</span>
          </div>

          <div class="form-group">
            <label>
              To
              <span class="mandatory">*</span>
              <span class="error-message datetime-error" v-if="errors.datetime">{{
                errors.datetime
              }}</span></label
            >
            <input
              type="datetime-local"
              v-model="form.to_datetime"
              :class="{ 'input-error': errors.to_datetime }"
            />
            <span class="error-message">{{ errors.to_datetime }}</span>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.is_all_day" />
              All Day
            </label>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.is_online_meeting" />
              Online Meeting
            </label>
          </div>
          <div class="form-group">
            <label
              >Participants
              <button type="button" class="btn-add-participants" @click="showParticipantModal">
                + Add Participants
              </button>
            </label>
            <!-- Add this section to display selected participants -->
            <div class="selected-participants" v-if="selectedParticipants.length > 0">
              <div
                v-for="participant in selectedParticipants"
                :key="participant.id"
                class="participant-tag"
              >
                <span>{{ participant.name }}</span>
                <button
                  type="button"
                  class="remove-participant"
                  @click="removeParticipant(participant)"
                >
                  ×
                </button>
              </div>
            </div>
            <div v-else class="no-participants-message">No participants selected</div>
          </div>
        </div>
      </div>
    </form>

    <ParticipantModal
      :show="showModal"
      :existing-participants="selectedParticipants"
      @close="showModal = false"
      @add-participants="handleAddParticipants"
    />
  </div>
</template>

<script setup lang="ts">
import ParticipantModal from '@/components/modals/ParticipantModal.vue'
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import {
  accountRepository,
  campaignRepository,
  contactRepository,
  dealsRepository,
  leadRepository,
  meetingRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import type { Campaign } from '@/types/campaigns/campaign'
import type { Contact } from '@/types/contacts/contact'
import type { Deal } from '@/types/deals/deal'
import type { Lead } from '@/types/leads/lead'
import type { Meeting, MeetingCreateEditPayload } from '@/types/meetings/meeting'
import type { UserOption } from '@/types/users/user'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'
const route = useRoute()
const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const meetingHosts = ref<UserOption[]>([])
const related_to = ref('')
const leads = ref<Lead[]>([])
const contacts = ref<Contact[]>([])
const accounts = ref<Account[]>([])
const deals = ref<Deal[]>([])
const campaigns = ref<Campaign[]>([])
const showModal = ref(false)
const selectedParticipants = ref<Participant[]>([])
const meeting = ref<Meeting>({} as Meeting)

interface Participant {
  id: number
  type: 'user' | 'contact' | 'lead'
  email: string
  name: string
}

const form = reactive<MeetingCreateEditPayload>({
  title: '',
  location: '',
  from_datetime: '',
  to_datetime: '',
  is_all_day: false,
  is_online_meeting: false,
  host: 0,
  participants: [],
  related_lead: null,
  related_contact: null,
  related_account: null,
  related_deal: null,
  related_campaign: null,
})

const errors = reactive({
  title: '',
  host: '',
  from_datetime: '',
  to_datetime: '',
  datetime: '',
})

const validateForm = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.host = ''
  errors.from_datetime = ''
  errors.to_datetime = ''
  errors.datetime = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.host) {
    errors.host = 'Host is required'
    isValid = false
  }

  if (!form.from_datetime) {
    errors.from_datetime = 'Start time is required'
    isValid = false
  }

  if (!form.to_datetime) {
    errors.to_datetime = 'End time is required'
    isValid = false
  }

  if (form.from_datetime && form.to_datetime) {
    const from = new Date(form.from_datetime)
    const to = new Date(form.to_datetime)
    if (from >= to) {
      errors.datetime = 'To Date Time must be after From Date Time'
      isValid = false
    }
  }

  return isValid
}

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const response = await userRepository.show()
    meetingHosts.value = response.results || response
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const fetchMeetingData = async (id: number) => {
  try {
    isLoading.value = true
    const response = await meetingRepository.index(id)
    console.log('Meeting data:', response)
    meeting.value = response.data || response

    // Format datetime strings to match input datetime-local format
    const formatDateTime = (dateStr: string) => {
      return dateStr ? dateStr.substring(0, 16) : '' // Get only YYYY-MM-DDTHH:mm part
    }

    // Populate form with meeting data
    Object.assign(form, {
      title: meeting.value.title,
      location: meeting.value.location,
      from_datetime: formatDateTime(meeting.value.from_datetime),
      to_datetime: formatDateTime(meeting.value.to_datetime),
      is_all_day: meeting.value.is_all_day,
      is_online_meeting: meeting.value.is_online_meeting,
      host: meeting.value.host,
      participants: meeting.value.participants,
      related_lead: meeting.value.related_lead,
      related_contact: meeting.value.related_contact,
      related_account: meeting.value.related_account,
      related_deal: meeting.value.related_deal,
      related_campaign: meeting.value.related_campaign,
    })

    // Set related_to and fetch related data
    if (meeting.value.related_campaign) {
      related_to.value = 'campaign'
      await fetchRelatedData('campaign')
      form.related_campaign = meeting.value.related_campaign?.id ?? null
    } else if (meeting.value.related_lead) {
      related_to.value = 'lead'
      await fetchRelatedData('lead')
      form.related_lead = meeting.value.related_lead?.id ?? null
    } else if (meeting.value.related_contact) {
      related_to.value = 'contact'
      await fetchRelatedData('contact')
      form.related_contact = meeting.value.related_contact?.id ?? null
    } else if (meeting.value.related_account) {
      related_to.value = 'account'
      await fetchRelatedData('account')
      form.related_account = meeting.value.related_account?.id ?? null
    } else if (meeting.value.related_deal) {
      related_to.value = 'deal'
      await fetchRelatedData('deal')
      form.related_deal = meeting.value.related_deal?.id ?? null
    }

    // Convert participants to the format needed for display
    if (meeting.value.participants && Array.isArray(meeting.value.participants)) {
      selectedParticipants.value = meeting.value.participants
        .map((p: any) => {
          let type: 'user' | 'contact' | 'lead'
          let id: number | null = null

          if (p.user) {
            type = 'user'
            id = p.user
          } else if (p.contact) {
            type = 'contact'
            id = p.contact
          } else if (p.lead) {
            type = 'lead'
            id = p.lead
          } else {
            return null
          }

          return {
            id,
            type,
            email: p.email || '',
            name: p.name || '',
          }
        })
        .filter((p): p is Participant => p !== null)

      // Update form participants
      form.participants = selectedParticipants.value.map((p) => ({
        user: p.type === 'user' ? p.id : null,
        contact: p.type === 'contact' ? p.id : null,
        lead: p.type === 'lead' ? p.id : null,
      }))
    }

    // Fetch related data if needed
    if (related_to.value) {
      await fetchRelatedData(related_to.value)
    }
  } catch (error) {
    console.error('Error fetching meeting data:', error)
    toast.error('Error loading meeting data', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const fetchRelatedData = async (type: string) => {
  try {
    isLoading.value = true
    switch (type) {
      case 'lead':
        const leadResponse = await leadRepository.show()
        leads.value = leadResponse.results
        break
      case 'contact':
        const contactResponse = await contactRepository.show()
        contacts.value = contactResponse.results
        break
      case 'account':
        const accountResponse = await accountRepository.show()
        accounts.value = accountResponse.results
        break
      case 'deal':
        const dealResponse = await dealsRepository.show()
        deals.value = dealResponse.results
        break
      case 'campaign':
        const campaignResponse = await campaignRepository.show()
        campaigns.value = campaignResponse.results
        break
    }
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

watch(related_to, (newValue) => {
  form.related_lead = null
  form.related_contact = null
  form.related_account = null
  form.related_deal = null
  form.related_campaign = null

  // Fetch related data based on selection
  if (newValue) {
    fetchRelatedData(newValue)
  }
})

const handleSave = async () => {
  if (validateForm()) {
    try {
      isLoading.value = true
      const meetingId = Number(route.params.id)

      // Format datetime strings for API
      const apiPayload = {
        ...form,
        from_datetime: form.from_datetime + ':00',
        to_datetime: form.to_datetime + ':00',
      }

      await meetingRepository.update(meetingId, apiPayload)
      toast.success('Meeting updated successfully', {
        position: POSITION.BOTTOM_RIGHT,
      })
      router.push('/meetings')
    } catch (error) {
      toast.error(error, {
        position: POSITION.BOTTOM_RIGHT,
      })
    } finally {
      isLoading.value = false
    }
  }
}

const handleCancel = () => {
  router.push('/meetings')
}

const showParticipantModal = () => {
  showModal.value = true
}

const handleAddParticipants = (participants: any[]) => {
  // Update the UI display with all participants
  selectedParticipants.value = participants

  // Update the form data - convert to API format
  form.participants = participants.map((p) => ({
    user: p.type === 'user' ? p.id : null,
    contact: p.type === 'contact' ? p.id : null,
    lead: p.type === 'lead' ? p.id : null,
  }))

  console.log('Updated participants:', form.participants)
}

// Add this function to handle participant removal
const removeParticipant = (participantToRemove: any) => {
  selectedParticipants.value = selectedParticipants.value.filter(
    (p) => p.id !== participantToRemove.id || p.type !== participantToRemove.type,
  )
  form.participants = form.participants.filter(
    (p: { user: number | null; contact: number | null; lead: number | null }) =>
      !(p[participantToRemove.type as 'user' | 'contact' | 'lead'] === participantToRemove.id),
  )
}

onMounted(async () => {
  await fetchDropdownData()
  const meetingId = Number(route.params.id)
  if (meetingId) {
    await fetchMeetingData(meetingId)
  }
})
</script>

<style scoped>
.selected-participants {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.participant-tag {
  background-color: #e3f2fd;
  border-radius: 16px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.remove-participant {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-participant:hover {
  color: #dc3545;
}

.no-participants-message {
  color: #666;
  font-style: italic;
  margin-top: 8px;
  font-size: 14px;
}

.btn-add-participants {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 12px;
  background-color: transparent;
  border: 1px solid #0056b3;
  color: #0056b3;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add-participants:hover {
  background-color: #e3f2fd;
}

.datetime-error {
  grid-column: span 2;
  margin-top: -8px;
  padding-left: 10px;
}
</style>
