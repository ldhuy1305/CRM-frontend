<template>
  <div class="account-info-page">
    <h2 class="title">Account Info</h2>
    <div class="account-details">
      <div class="detail-row" v-for="(item, index) in accountFields" :key="index">
        <span class="label">{{ item.label }}:</span>
        <span :class="['value', item.class]">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const accountFields = [
  { label: 'Full Name', value: 'Nguyen Huu Khoa' },
  { label: 'Email', value: 'huukhoa29@gmail.com' },
  { label: 'Role', value: 'Administrator' },
  { label: 'Status', value: 'Active', class: 'active' },
  { label: 'Created At', value: '2025-05-13' },
]
</script>

<style scoped>
.account-info-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 1000;
  background-color: white;
  bottom: 50px;
  width: 100%;
  margin-left: calc(-1 * ((43vw - 100%) / 2));
  border-radius: 10px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: black;
}

.subtitle {
  margin-bottom: 1.5rem;
  color: black;
}

.account-details {
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  color: #222;
}

.value.active {
  color: #10b981;
  font-weight: 600;
}

.back-button {
  text-align: right;
}
</style>
