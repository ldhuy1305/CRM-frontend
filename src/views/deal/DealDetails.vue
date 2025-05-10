<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />

    <!-- Header Section -->
    <div class="details-header">
      <div class="module-profile">
        <button class="icon-button btn-back" @click="router.back()">
          <span class="arrow-left"></span>
        </button>
        <div class="module-title">
          <h1>{{ deal?.name }}</h1>
          <div class="tag">
            <span>{{ formatCurrency(deal?.amount) }}</span>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn-tertiary">Send Email</button>
        <button class="btn-secondary" @click="navigateToEditDeal(deal.id)">Edit</button>
        <button class="btn-primary" @click="handleDelete(deal.id)">Delete</button>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <!-- Deal Progress -->
      <div class="info-card deal-progress">
        <div class="progress-dates">
          <div>
            <div class="date-label">START</div>
            <div class="date-value">{{ formatDate(deal?.created_at) }}</div>
          </div>
          <div>
            <div class="date-label">CLOSING</div>
            <div class="date-value">{{ formatDate(deal?.close_date) }}</div>
          </div>
        </div>
        <div class="stages-timeline">
          <div class="timeline">
            <div
              v-for="(stage, index) in filteredStages"
              :key="stage.id"
              class="timeline-item"
              :class="{
                active: stage.id === deal?.stage.id,
                completed: isStageCompleted(stage.id),
                last: index === filteredStages.length - 1,
              }"
            >
              <div class="timeline-step">
                <div class="step-marker">
                  <fas-icon v-if="isStageCompleted(stage.id)" icon="check" class="check-icon" />
                </div>
                <div class="step-label">{{ stage.name }}</div>
              </div>
              <div class="timeline-connector" v-if="index !== stages.length - 1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deal Information -->
      <div class="summary-card">
        <div class="section-content">
          <div class="info-row">
            <div class="info-label">Deal Owner</div>
            <div class="info-label">:</div>
            <div class="info-value">
              {{ deal?.deal_owner?.first_name }} {{ deal?.deal_owner?.last_name }}
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">Stage</div>
            <div class="info-label">:</div>
            <div class="info-value">{{ deal?.stage?.name }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Probability (%)</div>
            <div class="info-label">:</div>
            <div class="info-value">{{ (deal?.probability ?? 0) * 100 }}%</div>
          </div>
          <div class="info-row">
            <div class="info-label">Expected Revenue</div>
            <div class="info-label">:</div>
            <div class="info-value">{{ formatCurrency(deal?.expected_revenue) }}</div>
          </div>
        </div>
      </div>

      <!-- Contact Persons -->
      <div class="info-card">
        <div class="section-header">
          <h3>Contact Person</h3>
        </div>
        <div class="section-content">
          <div class="contact-card" v-if="deal?.contact">
            <div class="contact-avatar">
              <fas-icon icon="user-circle" size="5x" />
            </div>
            <div class="contact-info">
              <div class="contact-name">
                {{ deal.contact?.first_name }}{{ deal?.contact?.last_name }}
              </div>
              <div class="company-name">at {{ deal?.account?.name }}</div>
              <div class="contact-details">{{ deal?.contact?.phone }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage History -->
      <div class="info-card">
        <div class="section-header">
          <h3>Stage History</h3>
        </div>
        <div class="section-content">
          <table>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Amount</th>
                <th>Probability (%)</th>
                <th>Expected Revenue</th>
                <th>Stage Duration</th>
                <th>Modified Time</th>
                <!-- <th>Modified By</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in deal?.stage_histories" :key="history.id">
                <td>{{ getStageNameById(history.stage) }}</td>
                <td>{{ formatCurrency(history.amount) }}</td>
                <td>{{ history.probability * 100 }}%</td>
                <td>{{ formatCurrency(history.expected_revenue) }}</td>
                <td>{{ history.stage_duration }} days</td>
                <td>{{ formatDateTime(history.updated_at) }}</td>
                <!-- <td>{{ getModifiedByName(history) }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { dealsRepository, stageRepository } from '@/services'
import '@/styles/deals/styles.css'
import '@/styles/shared/index.css'
import type { Deal, Stage } from '@/types/deals/deal'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const deal = ref<Deal>({} as Deal)
const isLoading = ref(false)
const dealId = route.params.id as string

const formatCurrency = (value?: string) => {
  if (!value) return ''
  return parseFloat(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatDateTime = (datetime?: string) => {
  if (!datetime) return ''
  return new Date(datetime).toLocaleString('vi-VN')
}

const getStageNameById = (stageId: number) => {
  const stage = stages.value.find((stage) => stage.id === stageId)
  return stage ? stage.name : 'Unknown Stage'
}

const isStageCompleted = (stageId: number) => {
  if (!deal.value.stage.id) return false
  return stageId < deal.value.stage.id
}

const stages = ref<Stage[]>([])

const filteredStages = computed(() => {
  if (!stages.value.length) return []

  // Filter out both Closed Won (id=7) and Closed Lost (id=8) initially
  const nonClosedStages = stages.value.filter((stage) => stage.id !== 7 && stage.id !== 8)

  // Add the appropriate closing stage
  if (deal.value?.stage.id === 8) {
    // Add Closed Lost if current stage is Closed Lost
    const closedLostStage = stages.value.find((stage) => stage.id === 8)
    if (closedLostStage) nonClosedStages.push(closedLostStage)
  } else {
    // Add Closed Won for all other cases
    const closedWonStage = stages.value.find((stage) => stage.id === 7)
    if (closedWonStage) nonClosedStages.push(closedWonStage)
  }

  return nonClosedStages
})

const navigateToEditDeal = (id: number) => {
  router.push(`/deals/${id}/edit`)
}

const handleDelete = async (dealId: number) => {
  if (!confirm('Confirm to delete this Deal?')) {
    return
  }

  try {
    isLoading.value = true
    await dealsRepository.destroy(dealId)
    toast.success('Deal deleted successfully', {
      icon: '✅',
      position: POSITION.BOTTOM_RIGHT,
    })
    router.push('/deals')
  } catch (error) {
    toast.error('Failed to delete deal', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const fetchStages = async () => {
  try {
    const response = await stageRepository.show({ limit: 20 })
    stages.value = response.results.sort((a, b) => a.id - b.id)
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  }
}

const fetchDealDetails = async () => {
  try {
    isLoading.value = true
    const dealRes = await dealsRepository.index(dealId)
    deal.value = dealRes
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchDealDetails(), fetchStages()])
})
</script>
