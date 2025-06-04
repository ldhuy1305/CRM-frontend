<template>
  <div class="permission-card">
    <h3 class="permission-card__title">Permissions</h3>
    <p class="permission-card__subtitle">
      Here you can review permissions that are related to the selected User's Group. Also, you can
      assign additional permissions if needed.
    </p>

    <div class="permission-groups-wrapper">
      <div v-for="(group, index) in permissionGroups" :key="group.id" class="permission-group">
        <div class="group-header" @click="toggleCollapse(index)">
          <span class="group-title">{{ group.title }}</span>
          <span class="chevron" :class="{ rotated: !group.collapsed }">▼</span>
        </div>

        <transition name="dropdown">
          <div v-show="!group.collapsed" class="group-permissions">
            <div
              v-for="(perm, permIndex) in group.permissions"
              :key="perm.id"
              class="permission-item"
            >
              <label>
                <CRMInput
                  class="checkbox"
                  type="checkbox"
                  v-model="perm.checked"
                  @change="onPermissionChange(index, permIndex)"
                />
                {{ perm.label }}
              </label>

              <div v-if="perm.children" class="child-permissions">
                <label v-for="(child, childIndex) in perm.children" :key="child.id">
                  <CRMInput
                    class="checkbox"
                    type="checkbox"
                    v-model="child.checked"
                    @change="onChildPermissionChange(index, permIndex, childIndex)"
                  />
                  {{ child.label }}
                </label>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'
import CRMInput from '../ui/CRM-Input.vue'

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

const STORAGE_KEY = 'permissionGroups'

const defaultPermissionGroups: PermissionGroup[] = [
  {
    id: 'crm-contacts',
    title: 'CONTACT',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-contacts', label: 'View contact', checked: false },
      { id: 'edit-contacts', label: 'Edit contact', checked: false },
      { id: 'delete-contacts', label: 'Delete the contact', checked: false },
      { id: 'assign-contacts', label: 'Assign to other the contact', checked: false },
    ],
  },
  {
    id: 'crm-deals',
    title: 'DEAL',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-deals', label: 'View deals', checked: false },
      { id: 'create-deals', label: 'Create the deals', checked: false },
      { id: 'edit-deals', label: 'Edit deals', checked: false },
      { id: 'delete-deals', label: 'Delete the deals', checked: false },
      { id: 'close-deals', label: 'Close the deals', checked: false },
    ],
  },
  {
    id: 'crm-account',
    title: 'ACCOUNT',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-account', label: 'View accounts', checked: false },
      { id: 'create-account', label: 'Create an accounts', checked: false },
      { id: 'edit-account', label: 'Edit account details', checked: false },
      { id: 'delete-account', label: 'Delete the accounts', checked: false },
      { id: 'assign-account', label: 'Assign accounts to other users', checked: false },
    ],
  },
  {
    id: 'crm-campaign',
    title: 'CAMPAIGN',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-campaign', label: 'View campaign', checked: false },
      { id: 'create-campaign', label: 'Create campaign', checked: false },
      { id: 'edit-campaign', label: 'Edit campaign', checked: false },
      { id: 'delete-campaign', label: 'Delete campaign', checked: false },
    ],
  },
  {
    id: 'crm-task',
    title: 'TASK',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-task', label: 'View task', checked: false },
      { id: 'create-task', label: 'Create task', checked: false },
      { id: 'edit-task', label: 'Edit task', checked: false },
      { id: 'delete-task', label: 'Delete task', checked: false },
      { id: 'complete-task', label: 'Complete task', checked: false },
    ],
  },
  {
    id: 'crm-meeting',
    title: 'MEETING',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-meeting', label: 'View meeting', checked: false },
      { id: 'create-meeting', label: 'Create meeting', checked: false },
      { id: 'edit-meeting', label: 'Edit meeting', checked: false },
      { id: 'delete-meeting', label: 'Delete meeting', checked: false },
    ],
  },
  {
    id: 'crm-call',
    title: 'CALL',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-call', label: 'View call', checked: false },
      { id: 'create-call', label: 'Create call', checked: false },
      { id: 'edit-call', label: 'Edit call', checked: false },
      { id: 'delete-call', label: 'Delete call', checked: false },
    ],
  },
  {
    id: 'crm-report',
    title: 'REPORT',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-report', label: 'View report', checked: false },
      { id: 'create-report', label: 'Create report', checked: false },
      { id: 'edit-report', label: 'Edit report', checked: false },
      { id: 'delete-report', label: 'Delete report', checked: false },
    ],
  },
  {
    id: 'crm-user',
    title: 'USER',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-user', label: 'View user', checked: false },
      { id: 'create-user', label: 'Create user', checked: false },
      { id: 'edit-user', label: 'Edit user', checked: false },
      { id: 'delete-user', label: 'Delete user', checked: false },
    ],
  },
  {
    id: 'crm-admin',
    title: 'Admin & Access Control',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'manage-users', label: 'Manage users and roles', checked: false },
      { id: 'change-permission', label: 'Change permissions for groups', checked: false },
    ],
  },
]

const permissionGroups = reactive<PermissionGroup[]>([])

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed: PermissionGroup[] = JSON.parse(saved)
      const merged = defaultPermissionGroups.map((defaultGroup) => {
        const savedGroup = parsed.find((g) => g.id === defaultGroup.id)
        return savedGroup || defaultGroup
      })
      permissionGroups.splice(0, permissionGroups.length, ...merged)
    } catch {
      permissionGroups.splice(0, permissionGroups.length, ...deepClone(defaultPermissionGroups))
    }
  } else {
    permissionGroups.splice(0, permissionGroups.length, ...deepClone(defaultPermissionGroups))
  }
  console.log('permissionGroups after onMounted:', permissionGroups)
})

const toggleCollapse = (groupIndex: number) => {
  permissionGroups[groupIndex].collapsed = !permissionGroups[groupIndex].collapsed
}

const toggleGroup = (groupIndex: number) => {
  const group = permissionGroups[groupIndex]
  group.permissions.forEach((perm) => {
    perm.checked = group.checked
    perm.children?.forEach((c) => (c.checked = group.checked))
  })
}

const onPermissionChange = (groupIndex: number, permIndex: number) => {
  const group = permissionGroups[groupIndex]
  const perm = group.permissions[permIndex]

  if (perm.children) {
    perm.children.forEach((c) => (c.checked = perm.checked))
  }
}

const onChildPermissionChange = (groupIndex: number, permIndex: number, childIndex: number) => {
  const group = permissionGroups[groupIndex]
  const perm = group.permissions[permIndex]
  const child = perm.children?.[childIndex]
  if (!child) return

  child.checked = !child.checked

  if (perm.children) {
    perm.checked = perm.children.every((c) => c.checked)
  }
}

watch(
  permissionGroups,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

const emit = defineEmits<{
  (e: 'update:permissions', value: PermissionGroup[]): void
}>()

watch(
  () => permissionGroups,
  (newVal) => {
    emit(
      'update:permissions',
      permissionGroups
        .map((group) => ({
          ...group,
          permissions: group.permissions
            .map((perm) => ({
              ...perm,
              children: perm.children?.filter((c) => c.checked),
            }))
            .filter((perm) => perm.checked || perm.children?.some((c) => c.checked)),
        }))
        .filter((group) => group.permissions.length > 0),
    )
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
.permission-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 32px;
  background-color: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;

  &__title {
    font-size: 22px;
    font-weight: 700;
    color: #1c1e23;
    margin-bottom: 6px;
  }

  &__subtitle {
    font-size: 15px;
    color: #475569;
    margin-bottom: 24px;
    line-height: 1.6;
  }
}

.permission-groups-wrapper {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.permission-group {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.group-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    background-color: #f1f5f9;
  }

  .group-title {
    flex-grow: 1;
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    margin-left: 10px;
  }

  .chevron {
    font-size: 12px;
    transition: transform 0.3s ease;
    color: #ff4d00;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.group-permissions {
  margin-top: 14px;
  padding-left: 34px;
}

.permission-item {
  margin-bottom: 18px;

  label {
    font-size: 14px;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    font-weight: 200;

    &:hover {
      color: #ff4d00;
    }
  }
}

.child-permissions {
  margin-left: 24px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 4px;

    &:hover {
      color: #3b82f6;
    }
  }
}
</style>
