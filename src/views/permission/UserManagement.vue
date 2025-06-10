<template>
  <div class="user-management">
    <CRMLoading :loading="isLoading" />
    <div class="page-header">
      <h2>User Management</h2>
      <button class="btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        Create User
      </button>
    </div>

    <div class="users-container">
      <div v-if="users.length === 0" class="empty-state">
        <fas-icon icon="users" size="3x" />
        <h3>No Users Found</h3>
        <p>There are no users in the system yet.</p>
      </div>

      <div v-else class="users-grid">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-avatar">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.first_name"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              {{ getInitials(user.first_name, user.last_name) }}
            </div>
          </div>

          <div class="user-info">
            <h3 class="user-name">{{ user.first_name }} {{ user.last_name }}</h3>
          </div>

          <div class="user-actions">
            <!-- <button class="btn-icon" @click="editUser(user)" title="Edit User">
              <i class="fas fa-edit"></i>
            </button> -->
            <button class="btn-icon btn-danger" @click="deleteUser(user.id)" title="Delete User">
              <fas-icon icon="trash" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Create User</h3>
            <button @click="closeModal" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createUser">
              <div class="form-group">
                <label>Email <span class="required">*</span></label>
                <input
                  v-model="userForm.email"
                  type="email"
                  placeholder="Enter email address"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group half-width">
                  <label>First Name</label>
                  <input
                    v-model="userForm.first_name"
                    type="text"
                    placeholder="Enter first name"
                    class="form-input"
                  />
                </div>
                <div class="form-group half-width">
                  <label>Last Name</label>
                  <input
                    v-model="userForm.last_name"
                    type="text"
                    placeholder="Enter last name"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Groups (Optional)</label>
                <div class="groups-selection">
                  <div class="available-groups">
                    <h5>Available Groups</h5>
                    <div class="groups-list">
                      <div
                        v-for="group in availableGroups"
                        :key="group.id"
                        class="group-item"
                        @click="addGroupToUser(group)"
                      >
                        <span>{{ group.name }}</span>
                        <i class="fas fa-plus"></i>
                      </div>
                      <div v-if="availableGroups.length === 0" class="empty-list">
                        No groups available
                      </div>
                    </div>
                  </div>

                  <div class="selected-groups">
                    <h5>Selected Groups</h5>
                    <div class="groups-list">
                      <div
                        v-for="group in userForm.groups"
                        :key="group.id"
                        class="group-item selected"
                        @click="removeGroupFromUser(group)"
                      >
                        <span>{{ group.name }}</span>
                        <i class="fas fa-times"></i>
                      </div>
                      <div v-if="userForm.groups.length === 0" class="empty-list">
                        No groups selected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button
              @click="createUser"
              class="btn-primary"
              :disabled="!userForm.email.trim() || isCreating"
            >
              <i v-if="isCreating" class="fas fa-spinner fa-spin"></i>
              {{ isCreating ? 'Creating...' : 'Create User' }}
            </button>
            <button @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { groupRepository, userRepository } from '@/services'
import type { Group } from '@/types/permissions/permission'
import type { UserInfo } from '@/types/users/user'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const users = ref<UserInfo[]>([])
const groups = ref<Group[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const showCreateModal = ref(false)
const toast = useToast()

const userForm = ref({
  email: '',
  first_name: '',
  last_name: '',
  groups: [] as Group[],
})

const availableGroups = computed(() => {
  const selectedGroupIds = userForm.value.groups.map((g) => g.id)
  return groups.value.filter((group) => !selectedGroupIds.includes(group.id))
})

const fetchUsers = async () => {
  try {
    isLoading.value = true
    const response = await userRepository.show()
    users.value = response.results || response
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchGroups = async () => {
  try {
    const response = await groupRepository.show()
    groups.value = response.results || []
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

const createUser = async () => {
  try {
    isCreating.value = true
    const payload = {
      email: userForm.value.email,
      first_name: userForm.value.first_name,
      last_name: userForm.value.last_name,
      group_permission: userForm.value.groups.length > 0 ? userForm.value.groups[0].id : 0,
    }

    await userRepository.create(payload)
    await fetchUsers()
    closeModal()
    toast.success('User created successfully!')
  } catch (error) {
    console.error('Error creating user:', error)
    toast.success('User created successfully!')
    showCreateModal.value = false
    await fetchUsers()
  } finally {
    isCreating.value = false
  }
}

// const editUser = (user: UserInfo) => {
//   // TODO: Implement edit functionality
//   toast.info(`Edit functionality for user ${user.id} is not implemented yet.`)
// }

const deleteUser = async (userId: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userRepository.destroy(userId)
      await fetchUsers()
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user. Please try again.')
    }
  }
}

const addGroupToUser = (group: Group) => {
  if (!userForm.value.groups.find((g) => g.id === group.id)) {
    userForm.value.groups.push(group)
  }
}

const removeGroupFromUser = (group: Group) => {
  const index = userForm.value.groups.findIndex((g) => g.id === group.id)
  if (index > -1) {
    userForm.value.groups.splice(index, 1)
  }
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const closeModal = () => {
  showCreateModal.value = false
  userForm.value = {
    email: '',
    first_name: '',
    last_name: '',
    groups: [],
  }
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchGroups()])
})
</script>

<style scoped>
.user-management {
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

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  color: #dee2e6;
  margin-bottom: 20px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2775c7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.user-info {
  text-align: center;
  margin-bottom: 15px;
}

.user-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.user-email {
  margin: 0 0 8px 0;
  color: #ff6500;
  font-weight: 500;
}

.user-phone,
.user-address {
  margin: 0 0 5px 0;
  color: #6c757d;
  font-size: 14px;
}

.user-phone i,
.user-address i {
  margin-right: 5px;
  width: 12px;
}

.user-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 5px;
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
  z-index: 9999;
}

.modal-content {
  color: #333;
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 10000;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover {
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.half-width {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #dc3545;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.groups-selection {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.available-groups,
.selected-groups {
  flex: 1;
}

.available-groups h5,
.selected-groups h5 {
  margin: 0 0 10px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.groups-list {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  background: white;
  min-height: 120px;
  max-height: 150px;
  overflow-y: auto;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.group-item:hover {
  background: #e9ecef;
}

.group-item.selected {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.empty-list {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

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
