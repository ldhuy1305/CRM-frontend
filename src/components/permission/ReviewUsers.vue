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
          <li v-for="(group, index) in permissionState" :key="group.id">
            <div class="permission-header" @click="toggleCollapse(index)">
              <span>{{ group.title }}</span>
              <span class="chevron" :class="{ rotated: !group.collapsed }"> ▲ </span>
            </div>
            <ul v-if="!group.collapsed && group.permissions.length">
              <li v-for="permission in group.permissions" :key="permission.id">
                {{ permission.label }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { defineProps, reactive, watch, onMounted } from 'vue'

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

  const permissionState = reactive<PermissionGroup[]>(
    props.selectedPermissions.map((group) => ({
      ...group,
      collapsed: true,
    })),
  )

  function toggleCollapse(index: number) {
    permissionState[index].collapsed = !permissionState[index].collapsed
  }

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
    max-width: 1000px;
    margin: 40px auto;
    padding: 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    font-family: 'Segoe UI', Roboto, sans-serif;
    color: #1f2937;
    transition: all 0.3s ease-in-out;

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .section-title {
    margin-bottom: 6px;
    font-size: 24px;
    font-weight: 700;
    color: #111827;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .section-subtitle {
    margin-bottom: 32px;
    font-size: 16px;
    color: #6b7280;
  }

  .section {
    margin-bottom: 32px;

    &-heading {
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      border-left: 4px solid #ff4d00;
      padding-left: 12px;

      @media (max-width: 768px) {
        font-size: 16px;
      }
    }

    ul {
      margin: 0;
      padding-left: 0;
      list-style: none;

      > li {
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background-color: #f9fafb;
        color: #000;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
        }
      }

      ul {
        margin-top: 10px;
        padding-left: 16px;
        list-style-type: disc;

        li {
          margin-bottom: 4px;
          font-size: 14px;
          color: #4b5563;
        }
      }
    }
  }

  .permission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 5px 13px;
    font-weight: 600;
    font-size: 16px;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    span {
      display: flex;
      align-items: center;
    }
  }

  .chevron {
    font-size: 12px;
    color: #ff4d00;
    transition: transform 0.3s ease;
    margin-top: 7px;

    &.rotated {
      transform: rotate(180deg);
    }
  }
  </style>
