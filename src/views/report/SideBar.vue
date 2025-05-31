<template>
  <div class="sidebar-container">
    <h3>Categories</h3>
    <div class="category-list">
      <div
        v-for="category in categories"
        :key="category.id"
        :class="['category-item', { active: selectedCategory === category.id }]"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['category-selected'])

const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: 'All Reports' },
  { id: 'lead', name: 'Lead Reports' },
  { id: 'account', name: 'Contact and Account Reports' },
  { id: 'deal', name: 'Deal Reports' },
  { id: 'campaign', name: 'Campaign Reports' },
  { id: 'meeting', name: 'Meeting Reports' },
]

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  emit('category-selected', categoryId)
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
}

.category-item:hover {
  background-color: #e9ecef;
}

.category-item.active {
  background-color: #0d6efd;
  color: white;
}

h3 {
  margin: 0;
  color: #343a40;
  font-size: 18px;
}
</style>
