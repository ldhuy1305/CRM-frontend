<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Campaigns</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateCampaign">Create Campaign</button>
      </div>
    </div>

    <CampaignSearchForm @search="handleSearch" @clear="handleClear" />

    <div class="table-pagination">
      <div class="rows-per-page">
        Records per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <!-- <div class="pagination">
        <button class="nav-btn" :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
        <span class="current-page">{{ currentPage }}</span>
        <button
          class="nav-btn"
          :disabled="currentPage * rowsPerPage >= totalRecords"
          @click="currentPage++"
        >
          &gt;
        </button>
      </div> -->
    </div>

    <div class="module-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th @click="toggleSort('name')">
              <span>Campaign Name</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'name' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'name' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('type')">
              <span>Type</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'type' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'type' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('status')">
              <span>Status</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'status' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'status' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th @click="toggleSort('start_date')">
              <span>Start Date</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'start_date' && sortOrder === 'ASC' }"
                  >▲</span
                >
                <span :class="{ active: sortField === 'start_date' && sortOrder === 'DESC' }"
                  >▼</span
                >
              </span>
            </th>
            <th @click="toggleSort('end_date')">
              <span>End Date</span>
              <span class="sort-icons">
                <span :class="{ active: sortField === 'end_date' && sortOrder === 'ASC' }">▲</span>
                <span :class="{ active: sortField === 'end_date' && sortOrder === 'DESC' }">▼</span>
              </span>
            </th>
            <th>Campaign Owner</th>
          </tr>
        </thead>
        <tbody v-if="campaigns.length !== 0">
          <tr v-for="campaign in campaigns" :key="campaign.id" class="data-row">
            <td>
              <div class="data-name-cell">
                <div class="more-options">
                  <button class="more-btn" @click.stop="toggleMoreOptions(campaign.id)">⋮</button>
                  <div v-if="activeMoreOptions === campaign.id" class="options-dropdown">
                    <div @click="navigateToEditCampaign(campaign.id)">Edit</div>
                    <div @click="deleteCampaign(campaign.id)">Delete</div>
                  </div>
                </div>
              </div>
            </td>
            <td @click="navigateToCampaignDetails(campaign.id)">{{ campaign.name }}</td>
            <td>{{ campaign.campaign_type.name }}</td>
            <td>{{ campaign.campaign_status.name }}</td>
            <td>{{ campaign.start_date ? formatDate(campaign.start_date) : 'N/A' }}</td>
            <td>{{ campaign.end_date ? formatDate(campaign.end_date) : 'N/A' }}</td>
            <td>
              {{ campaign.campaign_owner?.first_name }} {{ campaign.campaign_owner?.last_name }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" style="text-align: center">No campaigns found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { campaignRepository } from '@/services'
import '@/styles/shared/index.css'
import type { Campaign } from '@/types/campaigns/campaign'
import { formatDate } from '@/utils/formatter'
import CampaignSearchForm from '@/views/campaign/CampaignSearchForm.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const campaigns = ref<Campaign[]>([])
const rowsPerPage = ref(10)
const activeMoreOptions = ref<number | null>(null)
const sortField = ref<string>('')
const sortOrder = ref<'ASC' | 'DESC'>('ASC')
const searchFilters = ref<Record<string, string>>({})
const isLoading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)

const fetchData = async () => {
  try {
    isLoading.value = true
    const payload = {
      limit: rowsPerPage.value,
      page: currentPage.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      ...searchFilters.value,
    }

    console.log('📤 Request payload:', payload)

    const response = await campaignRepository.show(payload)
    campaigns.value = response.results
    totalRecords.value = response.total
  } catch (error) {
    console.error('❌ Error fetching campaigns:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortField.value = field
    sortOrder.value = 'ASC'
  }
  fetchData()
}

const handleSearch = async (filters: Record<string, string>) => {
  currentPage.value = 1
  searchFilters.value = filters
  await fetchData()
}

const handleClear = async () => {
  searchFilters.value = {}
  currentPage.value = 1
  sortField.value = ''
  sortOrder.value = 'ASC'
  await fetchData()
}

const navigateToCreateCampaign = () => {
  router.push('/campaigns/create')
}

const navigateToCampaignDetails = (campaignId: number) => {
  router.push(`/campaigns/${campaignId}`)
}

const navigateToEditCampaign = (campaignId: number) => {
  router.push(`/campaigns/${campaignId}/edit`)
}

const toggleMoreOptions = (campaignId: number) => {
  activeMoreOptions.value = activeMoreOptions.value === campaignId ? null : campaignId
}

const deleteCampaign = async (campaignId: number) => {
  if (!confirm('Confirm to delete this campaign?')) return
  try {
    isLoading.value = true
    await campaignRepository.destroy(campaignId)
    console.log('✅ Campaign deleted successfully:', campaignId)
    await fetchData()
    activeMoreOptions.value = null
  } catch (error) {
    console.error('❌ Error deleting campaign:', error)
    alert('Failed to delete campaign. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const changePage = (newPage: number) => {
  currentPage.value = newPage
  fetchData()
}

onMounted(() => {
  fetchData()
})

watch(rowsPerPage, () => {
  fetchData()
})
watch([currentPage, rowsPerPage], () => {
  fetchData()
})
</script>

<style scoped>
thead {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #333;
}

thead th {
  padding: 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

thead th:hover {
  background-color: #f1f1f1;
}

.sort-icons {
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  user-select: none;
}

.sort-icons span {
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-bottom: -7px;
}

.sort-icons span.active {
  font-weight: bold;
  color: #333;
}

.sort-icons span:hover {
  color: #000;
}

.sort-icons span:active {
  color: #007bff;
}

.sort-icons span.active {
  color: #007bff;
}
</style>
