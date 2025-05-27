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
      <ul>
        <li v-for="(permission, index) in selectedPermissions" :key="index">
          {{ permission.title }}

          <ul v-if="permission.permissions.length">
            <li v-for="childPermission in permission.permissions">{{ childPermission.label }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, onMounted } from 'vue'

type ReviewUser = {
  name: string
  position: string
  email: string
}

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

const props = defineProps<{
  users: ReviewUser[]
  selectedPermissions: PermissionGroup[]
}>()

onMounted(() => {
  console.log('selectedPermissions on mounted:', props.selectedPermissions)
})

watch(
  () => props.selectedPermissions,
  (newVal) => {
    console.log('selectedPermissions changed:', newVal)
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  max-width: 1000px;
  margin: 40px auto;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 20px;
  }
}

.section-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.section {
  margin-bottom: 32px;

  &-heading {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #374151;
    border-left: 4px solid #ff4d00;
    padding-left: 12px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  ul {
    padding-left: 0;
    list-style: none;
    margin: 0;

    > li {
      background-color: #f9fafb;
      color: black;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f3f4f6;
        color: #ff4d00;
      }

      > span,
      > strong {
        font-weight: 600;
        font-size: 16px;
        color: #111827;
      }
    }

    ul {
      margin-top: 10px;
      padding-left: 16px;
      list-style-type: disc;

      li {
        font-size: 14px;
        color: #4b5563;
        margin-bottom: 4px;
      }
    }
  }
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9fafb;

  thead {
    background-color: #e5e7eb;
    font-weight: 600;
  }

  th,
  td {
    text-align: left;
    padding: 14px 18px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 15px;
    color: black;

    &:hover {
      color: #ff4d00;
      cursor: pointer;
      transition: color 0.2s ease-in-out;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #f3f4f6;
        transition: background-color 0.2s;
      }
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px;
      font-size: 14px;
    }
  }
}

ul {
  padding-left: 20px;
  list-style: disc;
  font-size: 15px;
  color: #374151;

  ul {
    list-style: circle;
    margin-top: 4px;
    margin-bottom: 8px;
    color: #4b5563;
  }

  li {
    margin-bottom: 8px;
  }
}
</style>
