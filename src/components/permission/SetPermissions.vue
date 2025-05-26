<template>
  <div class="permission-card">
    <h3 class="permission-card__title">Permissions</h3>
    <p class="permission-card__subtitle">
      Here you can review permissions that are related to selected User's Group. Also, you can
      assign additional permissions if needed.
    </p>

    <div class="permission-groups-wrapper">
      <div v-for="(group, index) in permissionGroups" :key="group.id" class="permission-group">
        <div class="group-header" @click="toggleCollapse(index)">
          <CRMInput type="checkbox" v-model="group.checked" @change="toggleGroup" />
          <span class="group-title">{{ group.title }}</span>
          <span class="chevron" :class="{ rotated: !group.collapsed }">▼</span>
        </div>

        <div v-show="!group.collapsed" class="group-permissions">
          <div
            v-for="(perm, permIndex) in group.permissions"
            :key="perm.id"
            class="permission-item"
          >
            <label>
              <CRMInput class="checkbox" type="checkbox" v-model="perm.checked" />
              {{ perm.label }}
            </label>

            <div v-if="perm.children" class="child-permissions">
              <label v-for="(child, childIndex) in perm.children" :key="child.id">
                <CRMInput class="checkbox" type="checkbox" v-model="child.checked" />
                {{ child.label }}
              </label>
            </div>
          </div>
        </div>
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

// key lưu localStorage
const STORAGE_KEY = 'permissionGroups'

// Dữ liệu mặc định (giữ nguyên như bạn đã cho)
const defaultPermissionGroups: PermissionGroup[] = [
  {
    id: 'crm-contacts',
    title: 'CONTACT',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-contacts', label: 'View — Admin, Salesman, Marketer', checked: false },
      { id: 'edit-contacts', label: 'Edit — Admin, Salesman', checked: false },
      { id: 'delete-contacts', label: 'Delete — Admin, Salesman', checked: false },
      { id: 'assign-contacts', label: 'Assign to other — Admin', checked: false },
    ],
  },
  {
    id: 'crm-leads',
    title: 'LEAD',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-leads', label: 'View — Admin, Salesman, Marketer', checked: false },
      { id: 'create-leads', label: 'Create — Admin, Salesman, Marketer', checked: false },
      { id: 'edit-leads', label: 'Edit — Admin, Salesman, Marketer', checked: false },
      { id: 'delete-leads', label: 'Delete — Admin', checked: false },
      { id: 'convert-leads', label: 'Convert — Admin', checked: false },
    ],
  },
  {
    id: 'crm-deals',
    title: 'DEAL',
    checked: false,
    collapsed: true,
    permissions: [
      { id: 'view-deals', label: 'View — Admin, Salesman, ', checked: false },
      { id: 'create-deals', label: 'Create — Admin, Salesman, ', checked: false },
      { id: 'edit-deals', label: 'Edit — Admin, Salesman', checked: false },
      { id: 'delete-deals', label: 'Delete — Admin, Salesman', checked: false },
      { id: 'close-deals', label: 'Close — Admin, Salesman', checked: false },
    ],
  },
  {
    id: 'crm-account',
    title: 'ACCOUNT',
    checked: false,
    collapsed: true,
    permissions: [
      {
        id: 'view-account',
        label:
          'View accounts — Admin/Manager: All, Salesman: Related to contact, Marketer: Assigned or in campaign',
        checked: false,
      },
      { id: 'create-account', label: 'Create new accounts — Admin/Manager only', checked: false },
      { id: 'edit-account', label: 'Edit account details — Admin/Manager only', checked: false },
      { id: 'delete-account', label: 'Delete accounts — Admin/Manager only', checked: false },
      { id: 'assign-account', label: 'Assign accounts to other users — Admin/Manager only', checked: false },
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

// Helper clone deeply to avoid reactivity issues on load
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Init reactive state from localStorage or default
const permissionGroups = reactive<PermissionGroup[]>([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed: PermissionGroup[] = JSON.parse(saved)
      // Trước khi gán, merge lại collapsed từ defaultPermissionGroups để giữ trạng thái collapse ban đầu
      const merged = parsed.map((savedGroup) => {
        const defaultGroup = defaultPermissionGroups.find((g) => g.id === savedGroup.id)
        return {
          ...savedGroup,
          collapsed: defaultGroup ? defaultGroup.collapsed : true,
        }
      })
      permissionGroups.splice(0, permissionGroups.length, ...merged)
    } catch {
      // Nếu lỗi thì load default
      permissionGroups.splice(0, permissionGroups.length, ...deepClone(defaultPermissionGroups))
    }
  } else {
    permissionGroups.splice(0, permissionGroups.length, ...deepClone(defaultPermissionGroups))
  }
})

const toggleCollapse = (groupIndex: number) => {
  permissionGroups[groupIndex].collapsed = !permissionGroups[groupIndex].collapsed
}

const toggleGroup = (groupIndex: number) => {
  const group = permissionGroups[groupIndex]
  group.checked = !group.checked
  group.permissions.forEach((p) => {
    p.checked = group.checked
    p.children?.forEach((c) => (c.checked = group.checked))
  })
}

const togglePermission = (groupIndex: number, permIndex: number) => {
  const group = permissionGroups[groupIndex]
  const permission = group.permissions[permIndex]
  permission.checked = !permission.checked

  // Nếu permission có children, toggle tất cả children theo permission.checked
  if (permission.children) {
    permission.children.forEach((c) => (c.checked = permission.checked))
  }

  // Cập nhật lại checked của group: nếu tất cả permission checked thì group checked = true, ngược lại false
  group.checked = group.permissions.every((p) => p.checked)
}

const toggleChildPermission = (groupIndex: number, permIndex: number, childIndex: number) => {
  const group = permissionGroups[groupIndex]
  const permission = group.permissions[permIndex]
  const child = permission.children?.[childIndex]
  if (!child) return

  child.checked = !child.checked

  // Cập nhật lại checked của permission: nếu tất cả children checked thì permission.checked = true, ngược lại false
  if (permission.children) {
    permission.checked = permission.children.every((c) => c.checked)
  }

  // Cập nhật lại checked của group
  group.checked = group.permissions.every((p) => p.checked)
}

// watch để lưu trạng thái vào localStorage khi permissionGroups thay đổi
watch(
  permissionGroups,
  (newVal) => {
    // Lưu trạng thái hiện tại (không lưu collapsed)
    const toSave = newVal.map((g) => ({
      ...g,
      // Không cần lưu collapsed, để khi load sẽ mặc định collapsed: true
      collapsed: true,
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  },
  { deep: true }
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
        .filter((g) => g.checked)
        .map((g) => ({
          ...g,
          permissions: g.permissions
            .filter((p) => p.checked)
            .map((p) => ({
              ...p,
              children: p.children?.filter((c) => c.checked),
            })),
        })),
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
