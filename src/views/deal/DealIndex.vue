<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Deals</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateDeal">Create Deal</button>
      </div>
    </div>
    <div class="filter-section">
      <div class="rows-filter">
        Records per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <div class="kanban-board">
      <div class="kanban-column" v-for="stage in stages" :key="stage.id">
        <div class="column-header" :class="getHeaderClass(stage.probability)">
          <div class="stage-info">
            <span class="stage-name">{{ stage.name }}</span>
            <span class="stage-percentage">{{ stage.probability * 100 }}%</span>
          </div>
          <div class="stage-amount">{{ getStageAmount(stage.name) }}</div>
        </div>
        <div class="deal-cards">
          <template v-if="getDealsByStage(stage.name).length > 0">
            <div class="deal-card" v-for="deal in getDealsByStage(stage.name)" :key="deal.id">
              <div class="card-title clickable" @click="navigateToDealDetail(deal.id)">
                {{ deal.name }}
              </div>
              <div class="card-details">
                <div class="account">
                  <fas-icon icon="fas fa-building"></fas-icon>
                  {{ deal.account?.name }}
                </div>
                <div class="contact">
                  <fas-icon icon="fas fa-user-tie"></fas-icon>
                  {{ deal.contact.first_name }} {{ deal.contact.last_name }}
                </div>
                <div class="owner">
                  <fas-icon icon="fas fa-user"></fas-icon>
                  {{ deal.deal_owner.last_name }} {{ deal.deal_owner.first_name }}
                </div>
                <div class="amount">
                  <fas-icon icon="fas fa-wallet"></fas-icon>
                  {{ formatVNDCurrency(deal.amount) }}
                </div>

                <div class="close-date">
                  <fas-icon icon="fas fa-calendar"></fas-icon>
                  {{ new Date(deal.close_date).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </template>
          <div v-else class="empty-state">No deals found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { dealsRepository, stageRepository } from '@/services'
import '@/styles/kanban/styles.css'
import '@/styles/shared/index.css'
import type { Deal, Stage } from '@/types/deals/deal'
import { formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const rowsPerPage = ref(10)
const stages = ref<Stage[]>([])
const deals = ref<Deal[]>([])
const isLoading = ref(false)
const toast = useToast()

const fetchDealData = async () => {
  try {
    isLoading.value = true
    const stageRes = await stageRepository.show({ limit: 20 })

    const dealsRes = await dealsRepository.show({ limit: rowsPerPage.value })

    stages.value = stageRes.results.sort((a, b) => a.id - b.id)
    deals.value = dealsRes.results
    console.log('Stages fetched:', {
      stageRes: stageRes.results,
    })
    console.log('Deals fetched:', {
      dealsRes: dealsRes.results,
    })
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const getHeaderClass = (probability: number) => {
  if (probability === 0) return 'red'
  if (probability === 1) return 'green'
  return 'blue'
}

const getDealsByStage = (stageName: string) => {
  return deals.value.filter((deal) => deal.stage.name === stageName)
}

const getStageAmount = (stageName: string) => {
  const stageDeals = getDealsByStage(stageName)
  const totalAmount = stageDeals.reduce((sum, deal) => {
    const dealAmount = deal?.amount || 0

    const numericAmount = typeof dealAmount === 'string' ? parseFloat(dealAmount) : dealAmount

    if (isNaN(numericAmount)) {
      console.warn(`Invalid amount for deal ${deal?.id}:`, dealAmount)
      return sum
    }

    return sum + numericAmount
  }, 0)
  return formatVNDCurrency(totalAmount)
}

const navigateToCreateDeal = () => {
  router.push('/deals/create')
}

const navigateToDealDetail = (dealId: number) => {
  router.push(`/deals/${dealId}`)
}

onMounted(() => {
  fetchDealData()
})

watch(rowsPerPage, () => {
  fetchDealData()
})
</script>
