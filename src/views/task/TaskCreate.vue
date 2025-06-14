<template>
  <div class="page-container">
    <CRMLoading :loading="isLoading" />
    <div class="module-header">
      <h1>Create Task</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="form-container">
      <div class="information-section">
        <h2>Task Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Task Owner<span class="mandatory">*</span></label>
            <select v-model="form.task_owner" :class="{ 'input-error': errors.task_owner }">
              <!-- <option :value="null"></option> -->
              <option v-for="owner in taskOwners" :key="owner.id" :value="owner.id">
                {{ owner.last_name }} {{ owner.first_name }}
              </option>
            </select>
            <span v-if="errors.task_owner" class="error-message">{{ errors.task_owner }}</span>
          </div>

          <div class="form-group">
            <label>Title<span class="mandatory">*</span></label>
            <input type="text" v-model="form.title" :class="{ 'input-error': errors.title }" />
            <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label>Due Date<span class="mandatory">*</span></label>
            <input
              type="date"
              v-model="form.due_date"
              :class="{ 'input-error': errors.due_date }"
            />
            <span v-if="errors.due_date" class="error-message">{{ errors.due_date }}</span>
          </div>

          <div class="form-group">
            <label>Contact</label>
            <select v-model="form.contact">
              <option :value="null"></option>
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.first_name }} {{ contact.last_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Account</label>
            <select v-model="form.related_account">
              <option :value="null"></option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Status<span class="mandatory">*</span></label>
            <select v-model="form.status" :class="{ 'input-error': errors.status }">
              <option :value="null"></option>
              <option v-for="status in taskStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
            <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
          </div>

          <div class="form-group">
            <label>Priority<span class="mandatory">*</span></label>
            <select v-model="form.priority" :class="{ 'input-error': errors.priority }">
              <option :value="null"></option>
              <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
                {{ priority.name }}
              </option>
            </select>
            <span v-if="errors.priority" class="error-message">{{ errors.priority }}</span>
          </div>

          <div class="form-group">
            <label>Related Deal</label>
            <select v-model="form.related_deal">
              <option :value="null"></option>
              <option v-for="deal in deals" :key="deal.id" :value="deal.id">
                {{ deal.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <div class="field-header">
              <label>Reminder</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="form.is_remind" :id="'remind-toggle'" />
                <label :for="'remind-toggle'" class="toggle-label"></label>
              </div>
            </div>
            <div class="reminder-section" v-if="form.is_remind">
              <div class="remind-options">
                <label>
                  <input type="radio" v-model="reminderType" value="on" />
                  On {{ formatDate(form.due_date ?? undefined) }} at
                  <input type="time" v-model="reminderTime" />
                </label>
              </div>
              <div class="remind-options">
                <label>
                  <input type="radio" v-model="reminderType" value="before" />
                  On
                  <select v-model="reminderDays">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  Day(s) of due date at
                  <input type="time" v-model="reminderTime" />
                </label>
              </div>
              <div class="notify-options">
                <label>Notify by:</label>
                <select v-model="notifyBy">
                  <option value="popup">Pop Up</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="field-header">
              <label>Repeat</label>
              <div class="toggle-switch">
                <input type="checkbox" v-model="form.is_repeat" :id="'repeat-toggle'" />
                <label :for="'repeat-toggle'" class="toggle-label"></label>
              </div>
            </div>

            <div class="repeat-section" v-if="form.is_repeat">
              <div class="repeat-type">
                <label>Repeat type:</label>
                <select v-model="repeatType">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div class="repeat-ends">
                <div class="end-option">
                  <input type="radio" v-model="endType" value="never" id="end-never" />
                  <label for="end-never">Never</label>
                </div>
                <div class="end-option">
                  <input type="radio" v-model="endType" value="after" id="end-after" />
                  <label for="end-after">After</label>
                  <input
                    type="number"
                    v-model="endAfterOccurrences"
                    min="1"
                    :disabled="endType !== 'after'"
                  />
                  times
                </div>
                <div class="end-option">
                  <input type="radio" v-model="endType" value="on" id="end-on" />
                  <label for="end-on">On</label>
                  <input type="date" v-model="endDate" :disabled="endType !== 'on'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="description-section">
        <h2>Description Information</h2>
        <div class="form-group">
          <textarea v-model="form.description" rows="6"></textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import {
  accountRepository,
  contactRepository,
  dealsRepository,
  prioriryRepository,
  taskRepository,
  taskStatusRepository,
  userRepository,
} from '@/services'
import '@/styles/shared/index.css'
import '@/styles/tasks/styles.css'
import type { Account } from '@/types/accounts/account'
import type { NamedObject } from '@/types/common/common_types'
import type { Contact } from '@/types/contacts/contact'
import type { Deal } from '@/types/deals/deal'
import type { TaskCreateEditPayload } from '@/types/task/task'
import type { UserOption } from '@/types/users/user'
import { formatDate } from '@/utils/formatter'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const taskOwners = ref<UserOption[]>([])
const taskStatuses = ref<NamedObject[]>([])
const priorities = ref<NamedObject[]>([])
const accounts = ref<Account[]>([])
const contacts = ref<Contact[]>([])
const deals = ref<Deal[]>([])

import { useAuthStore } from '@/stores/modules/auth'
const authStore = useAuthStore()
const getCurrentUserId = (): number => {
  if (authStore.user) {
    console.log('Current User ID:', authStore.user.user.id)
    return authStore?.user.user.id
  } else {
    return 0
  }
}
const form = reactive<TaskCreateEditPayload>({
  title: '',
  task_owner: getCurrentUserId(),
  due_date: '',
  status: 0,
  priority: 0,
  contact: null,
  related_account: null,
  related_deal: null,
  is_remind: false,
  is_repeat: false,
  is_completed: false,
  description: '',
  lead: null,
  related_campaign: null,
})

const errors = reactive({
  title: '',
  due_date: '',
  status: '',
  priority: '',
  task_owner: '', // Add this line
})

const reminderType = ref('on')
const reminderTime = ref('10:00')
const reminderDays = ref('1')
const notifyBy = ref('popup')

const repeatType = ref('daily')
const endType = ref('never')
const endAfterOccurrences = ref(1)
const endDate = ref('')

const validateForm = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.due_date = ''
  errors.status = ''
  errors.priority = ''
  errors.task_owner = ''

  if (!form.task_owner) {
    errors.task_owner = 'Task owner is required.'
    isValid = false
  }

  if (!form.title.trim()) {
    errors.title = 'Subject is required.'
    isValid = false
  }

  if (!form.due_date) {
    errors.due_date = 'Due Date is required.'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status is required.'
    isValid = false
  }

  if (!form.priority) {
    errors.priority = 'Priority is required.'
    isValid = false
  }

  return isValid
}

const fetchDropdownData = async () => {
  try {
    isLoading.value = true
    const [ownersRes, statusesRes, prioritiesRes, accountsRes, contactsRes, dealsRes] =
      await Promise.all([
        userRepository.show(),
        taskStatusRepository.show(),
        prioriryRepository.show(),
        accountRepository.show(),
        contactRepository.show(),
        dealsRepository.show(),
      ])

    taskOwners.value = ownersRes.results || ownersRes
    taskStatuses.value = statusesRes.results || statusesRes
    priorities.value = prioritiesRes.results || prioritiesRes
    accounts.value = accountsRes.results || accountsRes
    contacts.value = contactsRes.results || contactsRes
    deals.value = dealsRes.results || dealsRes
  } catch (error) {
    toast.error(error, {
      position: POSITION.BOTTOM_RIGHT,
    })
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  if (validateForm()) {
    try {
      isLoading.value = true
      const response = await taskRepository.create(form)
      toast.success('Task created successfully', {
        position: POSITION.BOTTOM_RIGHT,
      })
      router.push(`/tasks/${response.id}`)
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
  router.push('/tasks')
}

onMounted(() => {
  fetchDropdownData()
})
</script>
