<template>
  <div class="lead-details-page">
    <div class="lead-header">
      <div class="back-button">
        <button class="icon-button" @click="handleBack">
          <i class="arrow-left"></i>
        </button>
      </div>
      <div class="lead-profile">
        <div class="profile-image">
          <div class="avatar-placeholder">
            <img src="@/assets/default_avatar.png" alt="Lead Avatar" />
          </div>
        </div>
        <div class="lead-title">
          <h1>
            {{ lead.first_name }} {{ lead.last_name }} -
            <span class="company-name">{{ lead.company_name }}</span>
          </h1>
          <div class="tag"><span>Tag</span></div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="send-mail-btn">Send mail</button>
        <button class="convert-btn" @click="navigateToConvertLead(lead.id)">Convert</button>
        <button class="edit-btn" @click="navigateToEditLead(lead.id)">Edit</button>
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
          <h3>Lead Information</h3>
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
              <div class="info-value">{{ Number(lead.annual_revenue) }}đ</div>
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

      <div class="email-section">
        <div class="section-header">
          <h3>Email</h3>
          <button class="btn btn-primary email-btn">Send mail</button>
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
              <tr>
                <td><div class="email-icon"></div></td>
                <td>
                  <div>Title</div>
                  <div class="email-address">{{ lead.email }}</div>
                </td>
                <td>1:52 PM</td>
                <td>
                  {{ lead.lead_owner?.first_name || '-' }} {{ lead.lead_owner?.last_name || '-' }}
                </td>
                <td>Sent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="campaigns-section">
        <div class="section-header">
          <h3>Campaigns</h3>
          <button class="btn btn-primary">Add campaign</button>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { leadRepository } from '@/services/repositories/lead'
import type { Lead } from '@/types/leads/lead'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const lead = ref<Lead>({} as Lead)

const handleBack = () => {
  // // Check if we can go back in history
  // if (window.history.state?.back || document.referrer.includes('/leads')) {
  //   router.back()
  // } else {
  // Fallback to leads list if no history
  router.push('/leads')
  // }
}

const navigateToConvertLead = (leadId: number) => {
  router.push(`/leads/${leadId}/convert`)
}

const navigateToEditLead = (leadId: number) => {
  router.push(`/leads/${leadId}/edit`)
}

const fetchLeadDetails = async () => {
  try {
    const leadId = route.params.id as string
    const response = await leadRepository.index(leadId)
    console.log('✅ API Response:', response)
    lead.value = response
  } catch (error) {
    console.error('Error fetching lead details:', error)
  }
}

onMounted(() => {
  fetchLeadDetails()
})
</script>

<style>
.lead-details-page {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f0f5fa;
  min-height: 100vh;
  padding-bottom: 30px;
}

.lead-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.back-button {
  margin-right: 15px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.arrow-left {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-left: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: rotate(45deg);
}

.lead-profile {
  display: flex;
  align-items: center;
  flex: 1;
}

.profile-image {
  margin-right: 15px;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 24px;
}

.lead-title h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
}

.company-name {
  color: #666;
}

.tag {
  display: inline-block;
  margin-top: 5px;
  color: #666;
}

.tag span {
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}

.send-mail-btn {
  background-color: #ff8400;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #1a3353;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.convert-btn {
  background-color: #ff4d00;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.content-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card,
.details-section,
.email-section,
.campaigns-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.summary-card {
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.info-label {
  width: 130px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
}

.section-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.section-content {
  padding: 20px;
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 30px;
  margin-bottom: 30px;
}

.timestamp {
  font-size: 12px;
  color: #666;
}

.email-btn {
  font-size: 13px;
  padding: 6px 12px;
}

.email-table,
.campaigns-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #666;
  font-size: 13px;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.email-icon {
  width: 20px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 2px;
}

.email-address {
  font-size: 12px;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .lead-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    margin-top: 15px;
    width: 100%;
  }

  .btn {
    flex: 1;
  }
}
</style>
