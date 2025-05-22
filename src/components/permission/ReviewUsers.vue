<script setup lang="ts">
import { defineProps } from 'vue'

interface User {
  name: string
  position: string
  email: string
}

const props = defineProps<{
  users: User[]
  selectedPermissions: string[]
}>()
</script>

<template>
  <div class="card">
    <h3 class="section-title">Review</h3>
    <p class="section-subtitle">Here you can view selected parameters.</p>

    <div class="section">
      <h4 class="section-heading">User Details</h4>
      <table class="info-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Position</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.name }}</td>
            <td>{{ user.position }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
      
    </div>

    <div class="section">
      <h4 class="section-heading">Permissions</h4>
      <ul class="permissions-list">
        <li v-for="(perm, index) in selectedPermissions" :key="index">
          {{ perm }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 1000px;
  margin: auto;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.section {
  margin-bottom: 24px;
}

.section-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table thead {
  background-color: #f8f8f8;
  font-weight: 600;
}

.info-table th,
.info-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.permissions-list {
  padding-left: 16px;
  list-style-type: disc;
}

.permissions-list li {
  margin-bottom: 6px;
}
</style>
