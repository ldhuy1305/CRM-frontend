<template>
  <div class="user-select-table">
    <table>
      <thead>
        <tr>
          <th>
            <CRMInput type="checkbox" v-model="selectAll" />
          </th>
          <th>Name</th>
          <th>Company</th>
          <th>Position</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Inviter</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.email">
          <td>
            <CRMInput type="checkbox" :value="user.email" v-model="modelValue" />
          </td>
          <td>{{ user.name }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.position }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.inviter }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, watch } from 'vue'
import CRMInput from '../ui/CRM-Input.vue'

const emit = defineEmits(['add-users', 'update:selectedUserEmails'])

const props = defineProps<{
  selectedUserEmails: string[]
  users: any[]
}>()

const modelValue = defineModel<string[]>('selectedUserEmails', {
  default: [],
})

const allEmails = computed(() => props.users.map((user) => user.email))

const selectAll = computed({
  get: () => modelValue.value.length === props.users.length,
  set: (checked: boolean) => {
    modelValue.value = checked ? [...allEmails.value] : []
  },
})

const selectedUsers = computed(() =>
  props.users.filter((user) => modelValue.value.includes(user.email))
)

watch(
  modelValue,
  (newVal) => {
    localStorage.setItem('selectedUserEmails', JSON.stringify(newVal))
    emit('add-users', selectedUsers.value)
  },
  { deep: true, immediate: true }
)
</script>


<style scoped lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  min-width: 800px;

  th,
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: black;
  }

  th {
    background-color: #f3f4f6;
    color: #374151;
  }
}

@media (max-width: 768px) {
  table {
    min-width: unset;
    display: block;
    overflow-x: auto;
    white-space: nowrap;

    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6) {
      display: none;
    }
  }
}
</style>
