<template>
  <div class="home-container">
    <div class="welcome-header">
      <h2>
        Welcome <span class="user-name">{{ userName }}</span>
      </h2>
    </div>

    <div class="grid-layout">
      <!-- My Open Tasks -->
      <div class="table-section">
        <h3>My Open Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Related To</th>
              <th>Contact Name</th>
            </tr>
          </thead>
          <tbody>
            <!-- Task rows will go here -->
          </tbody>
        </table>
      </div>

      <!-- My Meetings -->
      <div class="table-section">
        <h3>My Meetings</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Related To</th>
              <th>Contact Name</th>
            </tr>
          </thead>
          <tbody>
            <!-- Meeting rows will go here -->
          </tbody>
        </table>
      </div>

      <!-- Today's Leads -->
      <div class="table-section">
        <h3>Today's Leads</h3>
        <div class="empty-state" v-if="true">
          <p>No Leads found.</p>
        </div>
      </div>

      <!-- My Deals Closing This Month -->
      <div class="table-section">
        <h3>My Deals Closing This Month</h3>
        <table>
          <thead>
            <tr>
              <th>Deal Name</th>
              <th>Amount</th>
              <th>Stage</th>
              <th>Closing Date</th>
              <th>Account Name</th>
              <th>Contact Name</th>
              <th>Deal Owner</th>
            </tr>
          </thead>
          <tbody>
            <!-- Deal rows will go here -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/modules/auth' // Import the auth store
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    return {
      userName: authStore.user?.user.first_name + ' ' + authStore.user?.user.last_name,
    }
  },
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-header {
  margin-bottom: 50px;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.table-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-section h3 {
  margin-bottom: 16px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 400;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-state img {
  width: 120px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #666;
}

.user-name {
  font-weight: bold;
  color: #ff6500;
}
</style>
