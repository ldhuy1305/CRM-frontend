<script setup lang="ts">
defineProps<{ selectedTab: string }>()
defineEmits<{ (e: 'selectTab', tab: string): void }>()
</script>

<template>
  <div class="sidebar">
    <ul>
      <li :class="{ active: selectedTab === 'basic' }" @click="$emit('selectTab', 'basic')">
        <font-awesome-icon :icon="['fas', 'circle-info']" />
        <span>Basic Info</span>
      </li>
      <li :class="{ active: selectedTab === 'account' }" @click="$emit('selectTab', 'account')">
        <font-awesome-icon :icon="['fas', 'gear']" />
        <span>Account</span>
      </li>
      <li :class="{ active: selectedTab === 'password' }" @click="$emit('selectTab', 'password')">
        <font-awesome-icon :icon="['fas', 'unlock-keyhole']" />
        <span>Change password</span>
      </li>
      <li :class="{ active: selectedTab === 'security' }" @click="$emit('selectTab', 'security')">
        <font-awesome-icon :icon="['fas', 'shield-halved']" />
        <span>Privacy and security</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  min-width: 200px;
  padding: 1rem;
  border-right: 1px solid #d1d5db;
  margin-left: calc(-1 * ((40vw - 50%) / 2));
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  padding: 0.5rem 10px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
  font-size: 16px;
  border-radius: 5px;
}

.sidebar li:hover {
  color: #1d8cf8;
  background-color: #f3f4f6;
  font-weight: 600;
}

.sidebar li:hover {
  background-color: white;
  color: #ff6500;
  font-weight: 600;
}

.sidebar li.active {
  background-color: #ff6500;
  color: white;
}

.sidebar li:hover font-awesome-icon,
.sidebar li.active font-awesome-icon {
  color: white;
  transform: scale(1.1);
}
.sidebar li :deep(svg) {
  margin-right: 12px;
}

</style>
