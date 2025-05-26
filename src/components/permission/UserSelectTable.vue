<template>
  <div class="user-select-table">
    <table>
      <thead>
        <tr>
          <th></th>
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
            <CRMInput
              type="checkbox"
              :value="user.email"
              v-model="modelValue"
            />
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
}>()

const users = [
  {
    name: 'Phan Duy Dong',
    company: 'BKHighTech',
    position: 'Software Engineer',
    email: 'pduydong@gmail.com',
    phone: '0926472891',
    inviter: 'Tran NhanBKHighTech',
  },
  {
    name: 'Anh Tran',
    company: 'ABCVietnam',
    position: 'Frontend Developer',
    email: 'abcvn@gmail.com',
    phone: '0935614863',
    inviter: 'Tran NhanABCVietnam',
  },
  {
    name: 'Nguyễn Thu Sương',
    company: 'XNOR',
    position: 'UX Designer',
    email: 'thusuong@gmail.com',
    phone: '0703233587',
    inviter: 'Tran NhanXNOR',
  },
  {
    name: 'Trần Phúc',
    company: 'Unitech DACH',
    position: 'Project Manager',
    email: 'phuctran51273@gmail.com',
    phone: '0906469822',
    inviter: 'AdminUnitech DACH',
  },
  {
    name: 'Job Steve',
    company: 'Apple',
    position: 'CEO',
    email: 'stevejob@gmail.com',
    phone: '0857292582',
    inviter: 'Tran NhanApple',
  },
  {
    name: 'Lee Brian',
    company: 'Saigon Technology',
    position: 'Backend Developer',
    email: 'brian001lee@gmail.com',
    phone: '0947163824',
    inviter: 'Lê Đức HuySaigon Technology',
  },
  {
    name: 'Tran Thanh Nhan',
    company: 'Agest Vietnam',
    position: 'CTO',
    email: 'ttnhan2642@gmail.com',
    phone: '0935614863',
    inviter: 'Tran NhanAgest Vietnam',
  },
  {
    name: 'Le Tran Huong Giang',
    company: 'Unitech DACH',
    position: 'HR Specialist',
    email: 'giangle@unitechdach.vn',
    phone: '0912345678',
    inviter: 'Tran NhanUnitech DACH',
  },
]

const modelValue = computed({
  get: () => props.selectedUserEmails,
  set: (val: string[]) => emit('update:selectedUserEmails', val),
})

const selectedUsers = computed(() =>
  users.filter((user) => modelValue.value.includes(user.email)),
)

watch(modelValue, () => {
  emit('add-users', selectedUsers.value)
})
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
