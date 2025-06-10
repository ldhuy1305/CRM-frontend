<template>
  <div class="permission-management">
    <CRMLoading :loading="isLoading" />
    <div class="page-header">
      <h2>Permission Management</h2>
      <button class="btn-primary" @click="refreshPermissions">
        <fas-icon icon="sync" />
        Refresh
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="search-container">
        <div class="search-box">
          <fas-icon icon="search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search permission"
            class="search-input"
          />
        </div>

        <div class="filter-controls">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="permissions-container">
      <div v-if="filteredPermissionGroups.length === 0" class="empty-state">
        <fas-icon icon="exclamation-circle" size="3x" />
        <h3>No Permission Groups Found</h3>
        <p>There are no permission groups available in the system.</p>
      </div>

      <div v-else class="permissions-categories">
        <div
          v-for="group in filteredPermissionGroups"
          :key="group.name"
          class="category-card"
          :class="{ expanded: expandedCategory === group.name }"
        >
          <div class="category-header" @click="toggleCategory(group.name)">
            <div class="category-info">
              <h3>{{ group.name.charAt(0).toUpperCase() + group.name.slice(1) }}</h3>
              <span class="category-stats">{{ group.permissions.length }} permissions</span>
            </div>
            <div class="category-actions">
              <fas-icon
                :icon="expandedCategory === group.name ? 'chevron-up' : 'chevron-down'"
                class="expand-icon"
              />
            </div>
          </div>

          <div v-if="expandedCategory === group.name" class="category-content">
            <div class="permissions-grid">
              <div
                v-for="permission in group.permissions"
                :key="permission.id"
                class="permission-item"
              >
                <div class="permission-header">
                  <h4>{{ permission.name }}</h4>
                  <span class="permission-id">#{{ permission.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { groupPermissionRepository } from '@/services'
import type { GroupPermissions } from '@/types/permissions/permission'
import { computed, onMounted, ref } from 'vue'

const permissionGroups = ref<GroupPermissions[]>([])
const isLoading = ref(false)
const expandedCategory = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')

const filteredPermissionGroups = computed(() => {
  let filtered = permissionGroups.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.permissions.some((permission) => permission.name.toLowerCase().includes(query)),
    )
  }

  // Filter by selected category
  if (selectedCategory.value) {
    filtered = filtered.filter((group) => group.name === selectedCategory.value)
  }

  return filtered
})

const availableCategories = computed(() => {
  return permissionGroups.value.map((group) => group.name).sort()
})

const fetchPermissions = async () => {
  try {
    isLoading.value = true
    const response = await groupPermissionRepository.show()
    // Handle the response structure - it's already an array of GroupPermissions
    permissionGroups.value = Array.isArray(response) ? response : response.results || []
    console.log('Fetched permission groups:', permissionGroups.value)
  } catch (error) {
    console.error('Error fetching permissions:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleCategory = (categoryName: string) => {
  expandedCategory.value = expandedCategory.value === categoryName ? null : categoryName
}

const refreshPermissions = async () => {
  await fetchPermissions()
}

onMounted(() => {
  fetchPermissions()
})
</script>

<style scoped>
.permission-management {
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

.filter-section {
  position: sticky;
  top: 0;
  background: white;
  padding: 15px;
  border-radius: 5px solid #dee2e6;
  z-index: 100;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 0;
}

.filter-select {
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
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

.category-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.category-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-header {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.category-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.category-stats {
  color: #6c757d;
  font-size: 14px;
}

.expand-icon {
  transition: transform 0.2s ease;
  color: #6c757d;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.category-content {
  padding: 20px;
  border-top: 1px solid #dee2e6;
  background: white;
}

.permissions-grid {
  display: grid;
  gap: 15px;
}

.permission-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  transition: all 0.2s ease;
}

.permission-item:hover {
  background: #e9ecef;
  border-color: #007bff;
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  /* margin-bottom: 15px; */
}

.permission-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  flex: 1;
  line-height: 1.3;
}

.permission-id {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.permission-details {
  display: grid;
  gap: 8px;
}

.permission-details > div {
  font-size: 14px;
  color: #495057;
}

.permission-details strong {
  color: #333;
}

.permission-codename code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.groups-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.group-tag {
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.content-type-badge {
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  margin-left: 8px;
}

.permission-model,
.permission-app {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>
