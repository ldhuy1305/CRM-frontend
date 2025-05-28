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
            {{ task?.title }}
          </h1>
          <div class="tag">
            <span>#{{ task?.id }}</span>
          </div>
          <span v-if="task?.is_completed" class="task-completed">Completed</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="action-buttons">
          <button v-if="!task?.is_completed" class="btn-complete" @click="handleCloseTask()">
            Mark as Completed
          </button>
          <button class="btn-secondary" @click="navigateToEditTask(task.id)">Edit</button>
          <button class="btn-primary" @click="handlDelete(task.id)">Delete</button>
        </div>
      </div>
    </div>

    <div class="task-content-section">
      <div class="task-summary-card">
        <div class="task-section-content">
          <div class="info-row">
            <div class="info-label">Priority:</div>
            <div class="info-value">
              {{ task?.priority?.name }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">Due Date:</div>
            <div class="info-value">
              {{ formatDate(task?.due_date ?? undefined) }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">Status:</div>
            <div class="info-value">
              {{ task?.status?.name }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">Account:</div>
            <div
              class="info-value clickable"
              v-if="task?.related_account"
              @click="navigateToAccount(task.related_account.id)"
            >
              {{ task.related_account.name }}
            </div>
            <div v-else>—</div>
          </div>

          <div class="info-row">
            <div class="info-label">Task Owner:</div>
            <div class="info-value">
              {{ task?.task_owner?.last_name }} {{ task?.task_owner?.first_name }}
            </div>
          </div>
        </div>
      </div>

      <div class="task-details-section">
        <div class="task-section-header">
          <h3>Task Information</h3>
        </div>
        <div class="task-section-content">
          <div class="info-grid">
            <div class="info-row">
              <label class="info-label">Title</label>
              <div class="info-value">{{ task?.title }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Due Date</label>
              <div class="info-value">{{ formatDate(task?.due_date ?? undefined) }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Contact</label>
              <div
                class="info-value clickable"
                v-if="task?.contact"
                @click="navigateToContact(task.contact.id)"
              >
                {{ task.contact.last_name }} {{ task.contact.first_name }}
              </div>
              <div v-else>—</div>
            </div>
            <div class="info-row">
              <label class="info-label">Account</label>
              <div
                class="info-value clickable"
                v-if="task?.related_account"
                @click="navigateToAccount(task.related_account.id)"
              >
                {{ task.related_account.name }}
              </div>
              <div v-else>—</div>
            </div>
            <div class="info-row">
              <label class="info-label">Status</label>
              <div class="info-value">{{ task?.status?.name }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Priority</label>
              <div class="info-value">{{ task?.priority?.name }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Created By</label>
              <div class="info-value">
                {{ task?.created_by?.last_name }} {{ task?.created_by?.first_name }}
                <div class="timestamp">{{ formatDateTime(task?.created_at) }}</div>
              </div>
            </div>
            <div class="info-row">
              <label class="info-label">Modified By</label>
              <div class="info-value" v-if="task?.updated_by">
                {{ task?.updated_by?.first_name }} {{ task?.updated_by?.last_name }}
                <div class="timestamp">{{ formatDateTime(task?.updated_at) }}</div>
              </div>
              <div v-else></div>
            </div>
            <div class="info-row">
              <label class="info-label">Reminder</label>
              <div class="info-value">{{ task?.is_remind ? '✓' : '' }}</div>
            </div>
            <div class="info-row">
              <label class="info-label">Repeat</label>
              <div class="info-value">{{ task?.is_repeat ? '✓' : '' }}</div>
            </div>
          </div>

          <h4 class="task-section-title">Description</h4>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Description</div>
              <div class="info-value">{{ task.description || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="task-right-sidebar">
        <div class="contact-info" v-if="task?.contact">
          <div class="task-contact-header">
            <h3>{{ task.contact.last_name }} {{ task.contact.first_name }}</h3>
            <button class="btn-tertiary">Send Email</button>
          </div>
          <div class="task-contact-details">
            <div v-if="task.contact.phone" class="detail-item">
              <!-- <i class="fas fa-phone"></i> -->
              <fas-icon icon="fas fa-phone"></fas-icon>
              {{ task.contact.phone }}
            </div>
            <div v-if="task.contact.email" class="detail-item">
              <fas-icon icon="fas fa-envelope"></fas-icon>
              {{ task.contact.email }}
            </div>
          </div>
        </div>

        <div class="related-items">
          <h3>Deal Summary</h3>
          <div v-if="task?.related_deal" class="deal-info">
            <div class="deal-name">{{ task.related_deal.name }}</div>
            <div class="deal-amount">{{ formatVNDCurrency(task.related_deal.amount) }}</div>
          </div>
          <div v-else>No Deals found</div>
        </div>

        <div class="activities">
          <h3>Open Activities</h3>
          <div class="activity-section">
            <div class="activity-type">
              Tasks <span>{{ openTasksCount }}</span>
            </div>
            <div class="activity-type">
              Meetings <span>{{ openMeetingsCount }}</span>
            </div>
            <div class="activity-type">
              Calls <span>{{ openCallsCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { taskRepository } from '@/services'
import '@/styles/shared/index.css'
import '@/styles/tasks/styles.css'
import type { Task } from '@/types/task/task'
import { formatDate, formatDateTime, formatVNDCurrency } from '@/utils/formatter'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const task = ref<Task>({} as Task)
const isLoading = ref(false)
const toast = useToast()
const openTasksCount = ref(0)
const openMeetingsCount = ref(0)
const openCallsCount = ref(0)

const fetchTask = async () => {
  try {
    isLoading.value = true
    const response = await taskRepository.index(id)
    task.value = response.data || response
  } catch (error) {
    console.error('Error fetching task:', error)
    toast.error('Failed to load task details', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const handleCloseTask = async () => {
  try {
    isLoading.value = true
    await taskRepository.update(id, {
      is_completed: true,
      status: 4,
      title: task.value.title,
      task_owner: task.value.task_owner?.id,
      lead: task.value.lead?.id ?? undefined,
      contact: task.value.contact?.id ?? undefined,
      related_account: task.value.related_account?.id ?? undefined,
      related_deal: task.value.related_deal?.id ?? undefined,
      related_campaign: task.value.related_campaign?.id ?? undefined,
    })
    await fetchTask()
    toast.success('Task closed successfully', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } catch (error) {
    console.error('Error closing task:', error)
    toast.error('Failed to close task', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const navigateToEditTask = (taskId: number) => {
  router.push(`/tasks/${taskId}/edit`)
}

const navigateToContact = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
}

const navigateToAccount = (accountId: number) => {
  router.push(`/accounts/${accountId}`)
}

const handlDelete = async (taskId: number) => {
  if (!confirm('Confirm to delete this Task?')) {
    return
  }
  try {
    isLoading.value = true
    await taskRepository.destroy(taskId)
    toast.success('Task deleted successfully', {
      position: POSITION.BOTTOM_RIGHT,
    })
    router.push('/tasks')
  } catch (error) {
    console.error('Error deleting task:', error)
    toast.error('Failed to delete task', {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTask()
})
</script>
