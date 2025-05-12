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
            <img src="@/assets/company_avatar.svg" alt="Account Avatar" />
          </div>
        </div>
        <div class="module-title">
          <h1>
            {{ account.name }}
          </h1>
          <div class="tag"><span>Tag</span></div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn-primary">Send mail</button>
        <button class="btn-secondary" @click="navigateToEditAccount(account.id)">Edit</button>
      </div>
    </div>

    <div class="content-section">
      <div class="summary-card">
        <div class="info-row">
          <div class="info-label">Account Owner</div>
          <div class="info-value">
            {{ account.account_owner?.last_name }} {{ account.account_owner?.first_name }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Industry</div>
          <div class="info-value">{{ account.industry?.name || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Employees</div>
          <div class="info-value">{{ account.employees || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Annual Revenue</div>
          <div class="info-value">
            {{ formatVNDCurrency(parseFloat(account.annual_revenue)) || '-' }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone</div>
          <div class="info-value">{{ account.phone || '-' }}</div>
        </div>
      </div>

      <div class="details-section">
        <div class="section-header">
          <h3>Details Information</h3>
        </div>

        <div class="section-content">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Account Owner</div>
              <div class="info-value">
                {{ account.account_owner?.last_name }} {{ account.account_owner?.first_name }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Rating</div>
              <div class="info-value">{{ account.rating?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Account Name</div>
              <div class="info-value">{{ account.name }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">{{ account.phone }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Website</div>
              <div class="info-value">
                <a
                  v-if="account.website"
                  :href="account.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="website-link"
                >
                  {{ account.website }}
                </a>
                <span v-else>-</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Fax</div>
              <div class="info-value">{{ account.fax || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Account Type</div>
              <div class="info-value">{{ account.account_type?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Industry</div>
              <div class="info-value">{{ account.industry?.name || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Employees</div>
              <div class="info-value">{{ account.employees || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Annual Revenue</div>
              <div class="info-value">
                {{ formatVNDCurrency(parseFloat(account.annual_revenue)) || '-' }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Created By</div>
              <div class="info-value">
                {{ account.created_by?.first_name }} {{ account.created_by?.last_name }}<br />
                <span class="timestamp">{{ new Date(account.created_at).toLocaleString() }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Modified By</div>
              <div class="info-value" v-if="account.updated_by">
                {{ account.updated_by?.first_name }} {{ account.updated_by?.last_name }}<br />
                <span class="timestamp">{{ new Date(account.updated_at).toLocaleString() }}</span>
              </div>
              <div v-else></div>
            </div>
          </div>

          <h4 class="section-title">Address Information</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Street</div>
              <div class="info-value">{{ account.street || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">City</div>
              <div class="info-value">{{ account.city || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Province</div>
              <div class="info-value">{{ account.state_province || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Postal Code</div>
              <div class="info-value">{{ account.postal_code || '-' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Country</div>
              <div class="info-value">{{ account.country || '-' }}</div>
            </div>
          </div>

          <h4 class="section-title">Description</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ account.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deals Section -->
      <div class="email-section">
        <div class="section-header">
          <h3>Deals</h3>
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
            <button class="btn-primary">Assign</button>
            <button class="btn-secondary" @click="navigateToCreateContact()">New</button>
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
            <tr
              v-for="contact in account.contacts"
              :key="contact.id"
              @click="navigateToContactDetail(contact.id)"
              class="clickable"
            >
              <td>{{ contact.last_name }} {{ contact.first_name }}</td>
              <td>{{ contact.email || '-' }}</td>
              <td>{{ contact.phone || '-' }}</td>
              <td>
                {{ contact.contact_owner.first_name || '' }}
                {{ contact.contact_owner.last_name || '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="email-section">
        <div class="section-header">
          <h3>Email</h3>
          <button class="btn-primary">Send mail</button>
        </div>
        <div class="email-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Subject</th>
                <th>Date</th>
                <th>Sent By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- <div class="campaigns-section">
        <div class="section-header">
          <h3>Campaigns</h3>
          <button class="btn-primary">Add campaign</button>
        </div>
        <div class="campaigns-table">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Expected Revenue</th>
                <th>Budgeted Cost</th>
                <th>Member Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hi</td>
                <td>Active</td>
                <td>Partner</td>
                <td>04/03/2025</td>
                <td>11/03/2025</td>
                <td>đ 300.000</td>
                <td>đ 300.000</td>
                <td>Scheduled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { accountRepository } from '@/services/repositories/account'
import '@/styles/shared/index.css'
import type { Account } from '@/types/accounts/account'
import { formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const account = ref<Account>({} as Account)

const handleBack = () => {
  router.push('/accounts')
}

const navigateToEditAccount = (accountId: number) => {
  router.push(`/accounts/${accountId}/edit`)
}

const navigateToCreateContact = () => {
  router.push('/contacts/create')
}

const navigateToContactDetail = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const fetchDetailsData = async () => {
  try {
    isLoading.value = true
    const accountId = route.params.id as string
    const accountResponse = await accountRepository.index(accountId)
    account.value = accountResponse.data || accountResponse

    console.log('✅ Data loaded successfully')
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

<style scoped>
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contacts-table th,
.contacts-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.contacts-table th {
  font-weight: 500;
  color: #666;
  background: #f8f9fa;
}

.btn-icon {
  padding: 6px;
  margin: 0 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.btn-icon:hover {
  color: #1a73e8;
}
</style>
