<template>
  <div class="group-management">
    <div class="page-header">
      <h2>Group Management</h2>
      <button class="btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        Create Group
      </button>
    </div>

    <div class="groups-container">
      <div
        v-for="group in groups"
        :key="group.id"
        class="group-card"
        :class="{ expanded: expandedGroup === group.id }"
      >
        <div class="group-header" @click="toggleGroup(group.id)">
          <div class="group-info">
            <h3>{{ group.name }}</h3>
            <span class="group-stats">
              {{ group.users.length }} users • {{ group.permissions.length }} permissions
            </span>
          </div>
          <div class="group-actions">
            <button class="btn-icon" @click.stop="editGroup(group)" title="Edit Group">
              <fas-icon icon="fa-edit"></fas-icon>
            </button>
            <button
              class="btn-icon btn-danger"
              @click.stop="deleteGroup(group.id)"
              title="Delete Group"
            >
              <fas-icon icon="fa-trash"></fas-icon>
            </button>
            <fas-icon
              :icon="['fas', 'chevron-down']"
              class="expand-icon"
              :class="{ rotated: expandedGroup === group.id }"
            ></fas-icon>
          </div>
        </div>

        <div v-if="expandedGroup === group.id" class="group-content">
          <div class="content-section">
            <h4>
              <fas-icon icon="fa-users"></fas-icon>
              Users ({{ group.users.length }})
            </h4>
            <div v-if="group.users.length === 0" class="empty-state">
              No users assigned to this group
            </div>
            <div v-else class="users-list">
              <div v-for="user in group.users" :key="user.id" class="user-item">
                <div class="user-info">
                  <span class="user-name">{{ user.first_name }} {{ user.last_name }}</span>
                  <span v-if="user.phone" class="user-phone">{{ user.phone }}</span>
                </div>
                <button class="btn-icon btn-danger btn-sm" title="Remove from group">
                  <fas-icon icon="fa-times"></fas-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="content-section">
            <h4>
              <fas-icon icon="fa-key"></fas-icon>
              Permissions ({{ group.permissions.length }})
            </h4>
            <div v-if="group.permissions.length === 0" class="empty-state">
              No permissions assigned to this group
            </div>
            <div v-else class="permissions-list">
              <div
                v-for="permission in group.permissions"
                :key="permission.id"
                class="permission-item"
              >
                <div class="permission-info">
                  <span class="permission-name">{{ permission.name }}</span>
                  <span v-if="permission.content_type" class="permission-model">
                    {{ permission.content_type.app_label }}.{{ permission.content_type.model }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Group Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content modal-large" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Group' : 'Create Group' }}</h3>
            <button @click="closeModal" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Group Name <span class="required">*</span></label>
              <input
                v-model="groupForm.name"
                type="text"
                placeholder="Enter group name"
                class="form-input"
                required
              />
            </div>

            <div class="form-row">
              <!-- Users Selection -->
              <div class="form-group half-width">
                <label>Select Users (Optional)</label>
                <div class="selection-container">
                  <div class="available-list">
                    <h5>Available Users</h5>
                    <div class="search-box">
                      <input
                        v-model="userSearchQuery"
                        type="text"
                        placeholder="Search permissions..."
                        class="form-input small"
                      />
                    </div>
                    <div class="list-box">
                      <div
                        v-for="user in filteredAvailableUsers"
                        :key="user.id"
                        class="list-item"
                        @click="addUserToGroup(user)"
                      >
                        <span>{{ user.first_name }} {{ user.last_name }}</span>
                      </div>
                      <div v-if="filteredAvailableUsers.length === 0" class="empty-list">
                        No user available
                      </div>
                    </div>
                  </div>

                  <div class="transfer-buttons">
                    <button type="button" class="btn-transfer" @click="addAllUsers">
                      <fas-icon icon="fas fa-angle-double-right"></fas-icon>
                    </button>
                    <button type="button" class="btn-transfer" @click="removeAllUsers">
                      <fas-icon icon="fas fa-angle-double-left"></fas-icon>
                    </button>
                  </div>

                  <div class="selected-list">
                    <h5>Selected User</h5>
                    <div class="list-box">
                      <div
                        v-for="user in selectedUsers"
                        :key="user.id"
                        class="list-item selected"
                        @click="removeUserFromGroup(user)"
                      >
                        <span>{{ user.first_name }} {{ user.last_name }}</span>
                        <fas-icon icon="fa-times" class="remove-icon"></fas-icon>
                      </div>
                      <div v-if="selectedPermissions.length === 0" class="empty-list">
                        No users selected
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Permissions Selection -->
              <div class="form-group half-width">
                <label>Select Permissions (Optional)</label>
                <div class="selection-container">
                  <div class="available-list">
                    <h5>Available Permissions</h5>
                    <div class="search-box">
                      <input
                        v-model="permissionSearchQuery"
                        type="text"
                        placeholder="Search permissions..."
                        class="form-input small"
                      />
                    </div>
                    <div class="list-box">
                      <div
                        v-for="permission in filteredAvailablePermissions"
                        :key="permission.id"
                        class="list-item"
                        @click="addPermissionToGroup(permission)"
                      >
                        <span>{{ permission.name }}</span>
                        <small v-if="permission.content_type">
                          {{ permission.content_type.app_label }}.{{
                            permission.content_type.model
                          }}
                        </small>
                      </div>
                      <div v-if="filteredAvailablePermissions.length === 0" class="empty-list">
                        No permissions available
                      </div>
                    </div>
                  </div>

                  <div class="transfer-buttons">
                    <button type="button" class="btn-transfer" @click="addAllPermissions">
                      <fas-icon icon="fas fa-angle-double-right"></fas-icon>
                    </button>
                    <button type="button" class="btn-transfer" @click="removeAllPermissions">
                      <fas-icon icon="fas fa-angle-double-left"></fas-icon>
                    </button>
                  </div>

                  <div class="selected-list">
                    <h5>Selected Permissions</h5>
                    <div class="list-box">
                      <div
                        v-for="permission in selectedPermissions"
                        :key="permission.id"
                        class="list-item selected"
                        @click="removePermissionFromGroup(permission)"
                      >
                        <span>{{ permission.name }}</span>
                        <small v-if="permission.content_type">
                          {{ permission.content_type.app_label }}.{{
                            permission.content_type.model
                          }}
                        </small>
                        <fas-icon icon="fa-times" class="remove-icon"></fas-icon>
                      </div>
                      <div v-if="selectedPermissions.length === 0" class="empty-list">
                        No permissions selected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="saveGroup" class="btn-primary" :disabled="!groupForm.name.trim()">
              {{ showEditModal ? 'Update' : 'Create' }}
            </button>
            <button @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { groupPermissionRepository, groupRepository, userRepository } from '@/services'
import type { Group, GroupPermissions, Permission } from '@/types/permissions/permission'
import type { UserInfo } from '@/types/users/user'
import { computed, onMounted, ref } from 'vue'

const groups = ref<Group[]>([])
const allUsers = ref<UserInfo[]>([])
const allPermissions = ref<Permission[]>([])
const isLoading = ref(false)
const expandedGroup = ref<number | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentEditGroup = ref<Group | null>(null)

// Search queries
const userSearchQuery = ref('')
const permissionSearchQuery = ref('')

const groupForm = ref({
  name: '',
  userIds: [] as number[],
  permissionIds: [] as number[],
})

// Computed properties for selected items
const selectedUsers = computed(() => {
  try {
    return allUsers.value.filter((user) => groupForm.value.userIds.includes(user.id))
  } catch (error) {
    console.error('Error in selectedUsers computed:', error)
    return []
  }
})

const selectedPermissions = computed(() => {
  try {
    return allPermissions.value.filter((permission) =>
      groupForm.value.permissionIds.includes(permission.id),
    )
  } catch (error) {
    console.error('Error in selectedPermissions computed:', error)
    return []
  }
})

// Computed properties for filtering
const filteredAvailableUsers = computed(() => {
  try {
    return allUsers.value
      .filter((user) => !groupForm.value.userIds.includes(user.id))
      .filter((user) => {
        if (!userSearchQuery.value) return true
        const searchTerm = userSearchQuery.value.toLowerCase()
        return (
          user.first_name.toLowerCase().includes(searchTerm) ||
          user.last_name.toLowerCase().includes(searchTerm)
        )
      })
  } catch (error) {
    console.error('Error in filteredAvailableUsers computed:', error)
    return []
  }
})

const filteredAvailablePermissions = computed(() => {
  try {
    return allPermissions.value
      .filter((permission) => !groupForm.value.permissionIds.includes(permission.id))
      .filter((permission) => {
        if (!permissionSearchQuery.value) return true
        const searchTerm = permissionSearchQuery.value.toLowerCase()
        return permission.name.toLowerCase().includes(searchTerm)
      })
  } catch (error) {
    console.error('Error in filteredAvailablePermissions computed:', error)
    return []
  }
})

const fetchGroups = async () => {
  try {
    isLoading.value = true
    const response = await groupRepository.show()
    groups.value = response.results
  } catch (error) {
    console.error('Error fetching groups:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const response = await userRepository.show()
    allUsers.value = response.results || response
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const fetchPermissions = async () => {
  try {
    const response = await groupPermissionRepository.show()
    // Extract all permissions from GroupPermissions
    const groupPermissions = response.results || response
    allPermissions.value = groupPermissions.flatMap((gp: GroupPermissions) => gp.permissions)
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

const toggleGroup = (groupId: number) => {
  expandedGroup.value = expandedGroup.value === groupId ? null : groupId
}

const editGroup = (group: Group) => {
  currentEditGroup.value = group
  groupForm.value.name = group.name
  groupForm.value.userIds = group.users.map((user) => user.id)
  groupForm.value.permissionIds = group.permissions.map((permission) => permission.id)
  showEditModal.value = true
}

const saveGroup = async () => {
  if (!groupForm.value.name.trim()) {
    alert('Group name is required')
    return
  }

  try {
    const payload = {
      name: groupForm.value.name,
      users: groupForm.value.userIds,
      permissions: groupForm.value.permissionIds,
    }

    if (showEditModal.value && currentEditGroup.value) {
      await groupRepository.update(currentEditGroup.value.id, payload)
    } else {
      await groupRepository.create(payload)
    }
    await fetchGroups()
    closeModal()
  } catch (error) {
    console.error('Error saving group:', error)
    alert('Error saving group. Please try again.')
  }
}

// User management functions
const addUserToGroup = (user: UserInfo) => {
  if (!groupForm.value.userIds.includes(user.id)) {
    groupForm.value.userIds.push(user.id)
  }
}

const removeUserFromGroup = (user: UserInfo) => {
  const index = groupForm.value.userIds.indexOf(user.id)
  if (index > -1) {
    groupForm.value.userIds.splice(index, 1)
  }
}

const addAllUsers = () => {
  filteredAvailableUsers.value.forEach((user) => {
    addUserToGroup(user)
  })
}

const removeAllUsers = () => {
  groupForm.value.userIds = []
}

// Permission management functions
const addPermissionToGroup = (permission: Permission) => {
  if (!groupForm.value.permissionIds.includes(permission.id)) {
    groupForm.value.permissionIds.push(permission.id)
  }
}

const removePermissionFromGroup = (permission: Permission) => {
  const index = groupForm.value.permissionIds.indexOf(permission.id)
  if (index > -1) {
    groupForm.value.permissionIds.splice(index, 1)
  }
}

const addAllPermissions = () => {
  filteredAvailablePermissions.value.forEach((permission) => {
    addPermissionToGroup(permission)
  })
}

const removeAllPermissions = () => {
  groupForm.value.permissionIds = []
}

const deleteGroup = async (groupId: number) => {
  if (confirm('Are you sure you want to delete this group?')) {
    try {
      await groupRepository.destroy(groupId)
      await fetchGroups()
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  currentEditGroup.value = null
  groupForm.value = {
    name: '',
    userIds: [],
    permissionIds: [],
  }
  userSearchQuery.value = ''
  permissionSearchQuery.value = ''
}

onMounted(async () => {
  await Promise.all([fetchGroups(), fetchUsers(), fetchPermissions()])
})
</script>

<style scoped>
.group-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: #0056b3;
}

.group-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.group-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.group-header {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.group-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.group-stats {
  color: #6c757d;
  font-size: 14px;
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #6c757d;
}

.btn-icon:hover {
  background: #e9ecef;
  color: #333;
}

.btn-danger:hover {
  background: #dc3545;
  color: white;
}

.expand-icon {
  margin-left: 10px;
  transition: transform 0.2s ease;
  color: #6c757d;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.group-content {
  padding: 20px;
  border-top: 1px solid #dee2e6;
  background: white;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  color: #333;
}

.empty-state {
  color: #6c757d;
  font-style: italic;
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 6px;
}

.users-list {
  display: grid;
  gap: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  display: block;
}

.user-phone {
  color: #6c757d;
  font-size: 14px;
}

.permissions-list {
  display: grid;
  gap: 8px;
}

.permission-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.permission-name {
  font-weight: 500;
  display: block;
  color: #666;
}

.permission-model {
  color: #6c757d;
  font-size: 12px;
  font-family: monospace;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 700px;
  width: 90%;
}

.modal-header {
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.required {
  color: #dc3545;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.half-width {
  color: #333;
  flex: 1;
}

.selection-container {
  display: flex;
  gap: 10px;
  align-items: stretch;
  min-height: 300px;
}

.available-list,
.selected-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.available-list h5,
.selected-list h5 {
  margin: 0 0 10px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.search-box {
  margin-bottom: 10px;
}

.form-input.small {
  padding: 6px;
  font-size: 12px;
}

.list-box {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px;
  background: white;
  overflow-y: auto;
  max-height: 250px;
}

.list-item {
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
}

.list-item:hover {
  background: #e9ecef;
}

.list-item.selected {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.list-item span {
  font-weight: 500;
  font-size: 13px;
}

.list-item small {
  color: #6c757d;
  font-size: 11px;
  margin-top: 2px;
}

.remove-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #dc3545;
  font-size: 10px;
}

.empty-list {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

.transfer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.btn-transfer {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-transfer:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Add the modal-large class */
.modal-large {
  max-width: 900px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Keep all existing styles and add these additional ones */
.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #545b62;
}
</style>
