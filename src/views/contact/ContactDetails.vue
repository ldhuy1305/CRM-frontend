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
            <img src="@/assets/default_avatar.png" alt="Contact Avatar" />
          </div>
        </div>
        <div class="module-title">
          <h1>
            {{ contact.last_name }} {{ contact.first_name }} -
            <span class="company-name">{{ account.name }}</span>
          </h1>
          <div class="tag">
            <span>#{{ account.id }}</span>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn-primary">Send mail</button>
        <button class="btn-secondary" @click="navigateToEditContact(contact.id)">Edit</button>
      </div>
    </div>

    <div class="content-section">
      <div class="summary-card">
        <div class="info-row">
          <div class="info-label">Contact Owner</div>
          <div class="info-value">
            {{ contact.contact_owner?.last_name }} {{ contact.contact_owner?.first_name }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Email</div>
          <div class="info-value">{{ contact.email || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone</div>
          <div class="info-value">{{ contact.phone || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Department</div>
          <div class="info-value">{{ contact.department || '-' }}</div>
        </div>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h3>Details Information</h3>
        </div>

        <div class="section-content">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Contact Owner</div>
              <div class="info-value">
                {{ contact.contact_owner?.last_name }} {{ contact.contact_owner?.first_name }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Lead Source</div>
              <div class="info-value">{{ contact.lead_source?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact Name</div>
              <div class="info-value">
                {{ contact?.last_name || '-' }} {{ contact?.first_name || '-' }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Account Name</div>
              <div class="info-value clickable" @click="navigateToAccountDetail(account.id)">
                {{ account.name }}
              </div>
            </div>
            <!-- <div class="info-row">
              <div class="info-label">Title</div>
              <div class="info-value">{{ contact. || '-' }}</div>
            </div> -->
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">{{ contact.phone }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">{{ contact.email }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Fax</div>
              <div class="info-value">{{ contact.fax || '-' }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Website</div>
              <div class="info-value">
                <a
                  :href="contact.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="website-link"
                >
                  {{ contact.website }}
                </a>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Assistant</div>
              <div class="info-value">{{ contact.assistant_name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date of Birth</div>
              <div class="info-value">{{ contact.birthday || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Assistant Phone</div>
              <div class="info-value">{{ contact.assistant_phone || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Department</div>
              <div class="info-value">{{ contact.department || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Created By</div>
              <div class="info-value">
                {{ contact.created_by?.first_name }} {{ contact.created_by?.last_name }}<br />
                <span class="timestamp">{{ new Date(contact.created_at).toLocaleString() }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Email Opt Out</div>
              <div class="info-value">{{ formatOptOut(contact.is_email_opt_out) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Modified By</div>
              <div class="info-value" v-if="contact.updated_by">
                {{ contact.updated_by?.first_name }} {{ contact.updated_by?.last_name }}<br />
                <span class="timestamp">{{ new Date(contact.updated_at).toLocaleString() }}</span>
              </div>
              <div v-else></div>
            </div>
            <div class="info-row">
              <div class="info-label">Call Opt Out</div>
              <div class="info-value">{{ formatOptOut(contact.is_call_opt_out) }}</div>
            </div>
          </div>

          <h4 class="section-title">Address Information</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Street</div>
              <div class="info-value">{{ contact.street || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">City</div>
              <div class="info-value">{{ contact.city || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Province</div>
              <div class="info-value">{{ contact.state_province || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Postal Code</div>
              <div class="info-value">{{ contact.postal_code || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Country</div>
              <div class="info-value">{{ contact.country || '-' }}</div>
            </div>
          </div>

          <h4 class="section-title">Description</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ contact.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { accountRepository } from '@/services/repositories/account'
import { contactRepository } from '@/services/repositories/contact'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import type { Contact } from '@/types/contacts/contact'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const contact = ref<Contact>({} as Contact)
const account = ref<Account>({} as Account)
const isLoading = ref(false)

const handleBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/contacts')
  }
}

const navigateToEditContact = (contactId: number) => {
  router.push(`/contacts/${contactId}/edit`)
}

const navigateToAccountDetail = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const formatOptOut = (value: boolean): string => {
  return value ? '✓' : ''
}

const fetchDetailsData = async () => {
  try {
    isLoading.value = true
    const contactId = route.params.id as string
    const contactResponse = await contactRepository.index(contactId)
    contact.value = contactResponse.data || contactResponse

    const accountId = contact.value.account

    if (accountId) {
      const accountResponse = await accountRepository.index(accountId)
      account.value = accountResponse.data || accountResponse
    }

    console.log('✅ Data loaded successfully')
    console.log('📦 Contact:', contact.value)
    console.log('📦 Account:', account.value)
  } catch (error) {
    console.error('Error fetching details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDetailsData()
})
</script>

<style></style>
