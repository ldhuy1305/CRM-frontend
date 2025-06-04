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
        <UserSelectTable v-model:selected-user-emails="selectedUserEmails" :users="listUsers" />
      </div>
    </div>

    <SetPermissions
      v-if="currentStep === 2"
      :role="role"
      :permissions="permissions"
      @update:role="(val: string) => (role = val)"
      @update:permissions="(val) => (permissions = val as PermissionGroup[])"
      @update:selectedPermissions="(val: string[]) => (selectedPermissions = val)"
    />

    <div v-if="currentStep === 1" class="section-box">
      <label for="groupName" class="section-title">Group Name</label>
      <p class="description-text">
        Enter a name to help you easily recognize and manage this user group later.
      </p>
      <CRMInput v-model="groupName" placeholder="Enter group name..." />
    </div>

    <ReviewUsers
      v-if="currentStep === 3"
      :users="users"
      :selectedPermissions="permissions"
      :groupName="groupName"
    />

    <div class="footer">
      <CRMButton class="btn-cancel" @click="goBack" :disabled="currentStep === 1">Back</CRMButton>
      <CRMButton class="btn-next" @click="goNext">
        {{ currentStep < steps.length ? 'Next ➜' : 'Finish' }}
      </CRMButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import CRMButton from '@/components/ui/CRMButton.vue'
import CRMInput from '@/components/ui/CRM-Input.vue'
import SetPermissions from '@/components/permission/SetPermissions.vue'
import ReviewUsers from '@/components/permission/ReviewUsers.vue'
import UserSelectTable from '@/components/permission/UserSelectTable.vue'

interface User {
  name: string
  company: string
  position: string
  email: string
  phone: string
  inviter: string
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

const groupName = ref<string>('')

const listUsers = [
  {
    name: 'Phan Duy Dong',
    company: 'BKHighTech',
    position: 'Software Engineer',
    email: 'pduydong@gmail.com',
    phone: '0926472891',
    inviter: 'Tran NhanBKHighTech',
  },
  {
    name: 'Anh Tran',
    company: 'ABCVietnam',
    position: 'Frontend Developer',
    email: 'abcvn@gmail.com',
    phone: '0935614863',
    inviter: 'Tran NhanABCVietnam',
  },
  {
    name: 'Nguyễn Thu Sương',
    company: 'XNOR',
    position: 'UX Designer',
    email: 'thusuong@gmail.com',
    phone: '0703233587',
    inviter: 'Tran NhanXNOR',
  },
  {
    name: 'Trần Phúc',
    company: 'Unitech DACH',
    position: 'Project Manager',
    email: 'phuctran51273@gmail.com',
    phone: '0906469822',
    inviter: 'AdminUnitech DACH',
  },
  {
    name: 'Job Steve',
    company: 'Apple',
    position: 'CEO',
    email: 'stevejob@gmail.com',
    phone: '0857292582',
    inviter: 'Tran NhanApple',
  },
  {
    name: 'Lee Brian',
    company: 'Saigon Technology',
    position: 'Backend Developer',
    email: 'brian001lee@gmail.com',
    phone: '0947163824',
    inviter: 'Lê Đức HuySaigon Technology',
  },
  {
    name: 'Tran Thanh Nhan',
    company: 'Agest Vietnam',
    position: 'CTO',
    email: 'ttnhan2642@gmail.com',
    phone: '0935614863',
    inviter: 'Tran NhanAgest Vietnam',
  },
  {
    name: 'Le Tran Huong Giang',
    company: 'Unitech DACH',
    position: 'HR Specialist',
    email: 'giangle@unitechdach.vn',
    phone: '0912345678',
    inviter: 'Tran NhanUnitech DACH',
  },
]

const users = reactive<User[]>([])
const selectedUserEmails = ref<string[]>([])
const role = ref<string>('')
const permissions = ref<PermissionGroup[]>([])
const selectedPermissions = ref<string[]>([])

onMounted(() => {
  try {
    const savedEmails = localStorage.getItem('selectedUserEmails')
    if (savedEmails) {
      selectedUserEmails.value = JSON.parse(savedEmails)
    }

    const savedGroup = localStorage.getItem('groupName')
    if (savedGroup) {
      groupName.value = savedGroup
    }
  } catch (e) {
    console.error('Lỗi khi đọc localStorage:', e)
  }
})

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

watch(groupName, (val) => {
  localStorage.setItem('groupName', val)
})

watch(
  () => selectedUserEmails.value,
  (newEmails) => {
    Object.assign(
      users,
      listUsers.filter((user) => newEmails.includes(user.email)),
    )
  },
  { immediate: true, deep: true },
)


const goNext = (): void => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    console.log('Finish:', {
      groupName: groupName.value,
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
</script>

<style scoped lang="scss">
.user-page {
  max-width: 900px;
  margin: auto;
  padding: 32px;
  font-family: sans-serif;

  .description-text {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;

    &:hover {
      color: #ff4d00;
    }
  }
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
