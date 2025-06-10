<template>
  <div class="permission-management-container">
    <Sidebar @item-selected="handleItemSelection" />
    <div class="main-content">
      <GroupManagement v-if="selectedItem === 'groups'" />
      <UserManagement v-else-if="selectedItem === 'users'" />
      <PermissionManagement v-else-if="selectedItem === 'permissions'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GroupManagement from './GroupManagement.vue'
import PermissionManagement from './PermissionManagement.vue'
import Sidebar from './Sidebar.vue'
import UserManagement from './UserManagement.vue'

const selectedItem = ref('users')

const handleItemSelection = (itemId: string) => {
  selectedItem.value = itemId
}
</script>

<style scoped>
.permission-management-container {
  display: flex;
  height: 100vh;
  padding: 24px;
}

.main-content {
  flex: 1;
  margin-left: 50px;
  padding: 20px;
  overflow-y: auto;
}

.placeholder {
  text-align: center;
  padding: 50px;
  color: #6c757d;
}
</style>
