<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Tasks</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="navigateToCreateTask">Create Task</button>
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
      <div class="kanban-column" v-for="status in statuses" :key="status.id">
        <div class="column-header">
          <div class="status-info">
            <span class="status-name">{{ status.name }}</span>
          </div>
          <div class="status-count">{{ getTasksByStatus(status.name).length }} tasks</div>
        </div>
        <div class="task-cards">
          <template v-if="getTasksByStatus(status.name).length > 0">
            <div class="task-card" v-for="task in getTasksByStatus(status.name)" :key="task.id">
              <div class="card-title clickable" @click="navigateToTaskDetail(task.id)">
                {{ task.title }}
              </div>
              <div class="card-details">
                <div class="priority" :class="getPriorityClass(task.priority.name)">
                  <fas-icon icon="fas fa-flag"></fas-icon>
                  {{ task.priority.name }}
                </div>
                <div class="owner">
                  <fas-icon icon="fas fa-user"></fas-icon>
                  {{ task.task_owner.last_name }} {{ task.task_owner.first_name }}
                </div>
                <div class="due-date" :class="{ overdue: isOverdue(task.due_date) }">
                  <fas-icon icon="fas fa-calendar"></fas-icon>
                  {{ formatDueDate(task.due_date) }}
                </div>
                <div v-if="task.related_deal" class="related-deal">
                  <fas-icon icon="fas fa-handshake"></fas-icon>
                  {{ task.related_deal.name }}
                </div>
              </div>
            </div>
          </template>
          <div v-else class="empty-state">No tasks found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { taskRepository, taskStatusRepository } from '@/services'
import '@/styles/kanban/styles.css'
import '@/styles/shared/index.css'
import type { NamedObject } from '@/types/common/common_types'
import type { Task } from '@/types/task/task'
import { formatDate } from '@/utils/formatter'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const rowsPerPage = ref(10)
const statuses = ref<NamedObject[]>([])
const tasks = ref<Task[]>([])
const isLoading = ref(false)
const toast = useToast()

const fetchTaskData = async () => {
  try {
    isLoading.value = true
    const [statusRes, tasksRes] = await Promise.all([
      taskStatusRepository.show(),
      taskRepository.show({ limit: rowsPerPage.value }),
    ])

    statuses.value = statusRes.results.sort((a, b) => a.id - b.id)
    tasks.value = tasksRes.results
  } catch (error) {
    toast.error(error, {
      icon: '❌',
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const getTasksByStatus = (statusName: string) => {
  return tasks.value.filter((task) => task.status.name === statusName)
}

const getPriorityClass = (priority: string) => {
  const classes = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  }
  return classes[priority as keyof typeof classes] || ''
}

const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return 'No due date'
  return formatDate(dueDate)
}

const navigateToCreateTask = () => {
  router.push('/tasks/create')
}

const navigateToTaskDetail = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
}

onMounted(() => {
  fetchTaskData()
})

watch(rowsPerPage, () => {
  fetchTaskData()
})
</script>

<style scoped>
.column-header {
  background-color: rgba(0, 123, 255, 0.1);
}

.status-name {
  font-weight: 600;
  font-size: 14px;
  color: #0056b3;
  max-width: calc(100% - 50px);
}

.task-card {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.priority {
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.priority-high {
  color: #dc3545;
}

.priority-medium {
  color: #ffc107;
}

.priority-low {
  color: #28a745;
}

.overdue {
  color: #dc3545;
  font-weight: bold;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.9em;
}

.card-details > div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-count {
  font-size: 0.9em;
  color: #666;
}
</style>
