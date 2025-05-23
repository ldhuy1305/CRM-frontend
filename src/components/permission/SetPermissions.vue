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
          <CRMInput
            type="checkbox"
            :modelValue="group.checked"
            @update:modelValue="toggleGroup(index)"
          />
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
              <CRMInput
                class="checkbox"
                type="checkbox"
                :modelValue="perm.checked"
                @update:modelValue="togglePermission(index, permIndex)"
              />
              {{ perm.label }}
            </label>

            <div v-if="perm.children" class="child-permissions">
              <label v-for="(child, childIndex) in perm.children" :key="child.id">
                <CRMInput
                  class="checkbox"
                  type="checkbox"
                  :modelValue="child.checked"
                  @update:modelValue="toggleChildPermission(index, permIndex, childIndex)"
                />
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
import { reactive } from 'vue'
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

const permissionGroups = reactive<PermissionGroup[]>([
  {
    id: 'crm-contacts',
    title: 'CONTACT',
    checked: false,
    collapsed: true,
    permissions: [
      {
        id: 'view-contacts',
        label: 'View — Admin, Salesman, Marketer',
        checked: false,
      },
      {
        id: 'edit-contacts',
        label: 'Edit — Admin, Salesman',
        checked: false,
      },
      {
        id: 'delete-contacts',
        label: 'Delete — Admin, Salesman',
        checked: false,
      },
      {
        id: 'assign-contacts',
        label: 'Assign to other — Admin',
        checked: false,
      },
    ],
  },
  {
    id: 'crm-leads',
    title: 'LEAD',
    checked: false,
    collapsed: true,
    permissions: [
      {
        id: 'view-leads',
        label: 'View — Admin, Salesman, Marketer',
        checked: false,
      },
      {
        id: 'create-leads',
        label: 'Create — Admin, Salesman, Marketer',
        checked: false,
      },
      {
        id: 'edit-leads',
        label: 'Edit — Admin, Salesman, Marketer',
        checked: false,
      },
      {
        id: 'delete-leads',
        label: 'Delete — Admin',
        checked: false,
      },
      {
        id: 'convert-leads',
        label: 'Convert — Admin',
        checked: false,
      },
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
      { id: 'view-account', label: 'View — Admin, Salesman, Marketer', checked: false },
      { id: 'create-account', label: 'Create — Admin', checked: false },
      { id: 'edit-account', label: 'Edit — Admin', checked: false },
      { id: 'delete-account', label: 'Delete — Admin', checked: false },
      { id: 'assign-account', label: 'Assign to other — Admin', checked: false },
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
])

const toggleCollapse = (groupIndex: number) => {
  permissionGroups[groupIndex].collapsed = !permissionGroups[groupIndex].collapsed
}

const toggleGroup = (groupIndex: number) => (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  const group = permissionGroups[groupIndex]
  group.checked = isChecked
  group.permissions.forEach((p) => {
    p.checked = isChecked
    p.children?.forEach((c) => (c.checked = isChecked))
  })
}

const togglePermission = (groupIndex: number, permIndex: number) => (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  const permission = permissionGroups[groupIndex].permissions[permIndex]
  permission.checked = isChecked
  permission.children?.forEach((c) => (c.checked = isChecked))
}

const toggleChildPermission =
  (groupIndex: number, permIndex: number, childIndex: number) => (event: Event) => {
    const isChecked = (event.target as HTMLInputElement).checked
    const child = permissionGroups[groupIndex].permissions[permIndex].children?.[childIndex]
    if (child) {
      child.checked = isChecked
    }
  }
</script>

<style scoped>
.permission-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 32px;
  background-color: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
}

.permission-card__title {
  font-size: 22px;
  font-weight: 700;
  color: #1c1e23;
  margin-bottom: 6px;
}

.permission-card__subtitle {
  font-size: 15px;
  color: #475569;
  margin-bottom: 24px;
  line-height: 1.6;
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
}

.permission-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.group-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  padding: 8px;
  border-radius: 8px;
}

.group-header:hover {
  background-color: #f1f5f9;
}

.group-header .group-title {
  flex-grow: 1;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
  margin-left: 10px;
}

.group-header .chevron {
  font-size: 12px;
  transition: transform 0.3s ease;
  color: #ff4d00;
}

.group-header .chevron.rotated {
  transform: rotate(180deg);
}

.group-permissions {
  margin-top: 14px;
  padding-left: 34px;
}

.permission-item {
  margin-bottom: 18px;
}

.permission-item label {
  font-size: 14px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-weight: 200;
}

.permission-item label:hover {
  color: #ff4d00;
}

.child-permissions {
  margin-left: 24px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.child-permissions label {
  font-size: 14px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 4px;
}

.child-permissions label:hover {
  color: #3b82f6;
}
</style>
