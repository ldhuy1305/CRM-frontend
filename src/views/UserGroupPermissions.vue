<template>
  <div class="user-page">
    <div class="stepper">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="step-item"
        :class="{ active: currentStep === index + 1 }"
      >
        <div class="step-circle">{{ index + 1 }}</div>
        <span class="step-label">{{ step }}</span>
      </div>
    </div>

    <div v-if="currentStep === 1" class="card">
      <h3 class="card-title">Set User Details</h3>
      <p class="card-subtitle">
        You can add multiple users at once with the same access type and permissions.
      </p>
      <div class="section-box">
        <h4 class="section-title">Select Users from Existing Table</h4>
        <UserSelectTable
          v-model:selected-user-emails="selectedUserEmails"
          @add-users="handleSelectedUsers"
        />
      </div>
    </div>

    <SetPermissions
      v-if="currentStep === 2"
      :role="role"
      :permissions="permissions"
      @update:role="(val: string) => (role = val)"
      @update:permissions="(val: PermissionGroup[]) => (permissions = val)"
      @update:selectedPermissions="(val: string[]) => (selectedPermissions = val)"
    />

    <ReviewUsers v-if="currentStep === 3" :users="users" :selectedPermissions="permissions" />

    <div class="footer">
      <CRMButton class="btn-cancel" @click="goBack" :disabled="currentStep === 1">Back</CRMButton>
      <CRMButton class="btn-next" @click="goNext">
        {{ currentStep < steps.length ? 'Next ➜' : 'Finish' }}
      </CRMButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import CRMButton from '@/components/ui/CRMButton.vue'
import SetPermissions from '@/components/permission/SetPermissions.vue'
import ReviewUsers from '@/components/permission/ReviewUsers.vue'
import UserSelectTable from '@/components/permission/UserSelectTable.vue'

interface User {
  name: string
  position: string
  email: string
}

interface PermissionItem {
  id: string
  label: string
  checked: boolean
  children?: PermissionItem[]
}

interface PermissionGroup {
  id: string
  title: string
  checked: boolean
  collapsed: boolean
  permissions: PermissionItem[]
}

const steps = ['Set Details', 'Set Permissions', 'Review']
const currentStep = ref<number>(1)

const users = reactive<User[]>([])
const selectedUserEmails = ref<string[]>([])

const savedEmails = localStorage.getItem('selectedUserEmails')
if (savedEmails) {
  selectedUserEmails.value = JSON.parse(savedEmails)
}

const savedUsers = localStorage.getItem('selectedUsers')
if (savedUsers) {
  const parsedUsers: User[] = JSON.parse(savedUsers)
  users.splice(0, users.length, ...parsedUsers)
}

watch(
  users,
  (newUsers) => {
    selectedUserEmails.value = newUsers.map((u) => u.email)
    localStorage.setItem('selectedUsers', JSON.stringify(newUsers))
  },
  { deep: true, immediate: true },
)

watch(
  selectedUserEmails,
  (newEmails) => {
    localStorage.setItem('selectedUserEmails', JSON.stringify(newEmails))
  },
  { immediate: true },
)

const role = ref<string>('')
const permissions = ref<PermissionGroup[]>([])
const selectedPermissions = ref<string[]>([])

const goNext = (): void => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    console.log('Finish:', {
      users,
      role: role.value,
      selectedPermissions: selectedPermissions.value,
    })
  }
}

const goBack = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSelectedUsers = (selected: User[]): void => {
  users.splice(
    0,
    users.length,
    ...selected.map((user) => ({
      name: user.name,
      position: user.position || '',
      email: user.email,
    })),
  )
  selectedUserEmails.value = selected.map((u) => u.email)
}
</script>

<style scoped lang="scss">
.user-page {
  max-width: 900px;
  margin: auto;
  padding: 32px;
  font-family: sans-serif;

  .stepper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    position: relative;

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 50%;
        width: 100%;
        height: 2px;
        background-color: #d1d5db;
        z-index: 0;
      }

      &:not(:first-child)::before {
        content: '';
        position: absolute;
        top: 15px;
        right: 50%;
        width: 40px;
        height: 2px;
        background-color: #d1d5db;
        z-index: 0;
      }

      &.active {
        & ~ .step-item::before {
          background-color: #d1d5db;
        }
        &::after {
          background-color: #3b82f6;
        }

        .step-circle {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .step-label {
          font-weight: bold;
          color: #3b82f6;
        }
      }

      .step-circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #9b9b9b;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        background: white;
        color: black;
        font-weight: bold;
        z-index: 1002;
      }

      .step-label {
        font-size: 14px;
        color: black;
      }
    }
  }

  .card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;

    &-title {
      font-size: 20px;
      color: #000;
      margin-bottom: 10px;
    }

    &-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
    }
  }

  .section-box {
    padding: 16px 0;
    border-top: 1px solid #e5e7eb;
    margin-top: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 20px;

    .btn-cancel,
    .btn-next {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn-cancel {
      background: #0b192c;
      color: white;
    }

    .btn-next {
      background: #3b82f6;
      color: white;
    }
  }
}
</style>
