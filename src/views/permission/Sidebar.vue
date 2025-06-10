<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="sidebar-container">
    <h3>Access Management</h3>
    <div class="category-list">
      <div
        v-for="item in managementItems"
        :key="item.id"
        :class="['category-item', { active: selectedItem === item.id }]"
        @click="selectItem(item.id)"
      >
        <fas-icon :icon="item.icon" class="me-2" />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['item-selected'])

const selectedItem = ref('users')

const managementItems = [
  { id: 'users', name: 'Users', icon: 'fa-users' },
  { id: 'groups', name: 'Groups', icon: 'fa-layer-group' },
  { id: 'permissions', name: 'Permissions', icon: 'fa-key' },
]

const selectItem = (itemId: string) => {
  selectedItem.value = itemId
  emit('item-selected', itemId)
}
</script>

<style scoped>
.sidebar-container {
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px;
  height: 100%;
  border-right: 1px solid #dee2e6;
}

.category-list {
  margin-top: 20px;
}

.category-item {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: all 0.2s ease;
  color: #343a40;
}

.category-item:hover {
  background-color: #e9ecef;
}

.category-item.active {
  background-color: #ff6500;
  color: white;
}

h3 {
  margin: 0;
  color: #343a40;
  font-weight: 600;
  font-size: 18px;
}
</style>
