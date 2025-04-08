<template>
  <div class="leads-container">
    <div class="leads-header">
      <h1>Leads</h1>
      <div class="header-actions">
        <button class="create-lead-btn" @click="navigateToCreateLead">Create Lead</button>
        <button class="actions-btn">
          Actions
          <span class="dropdown-arrow">▼</span>
        </button>
      </div>
    </div>

    <div class="leads-table">
      <table>
        <thead>
          <tr>
            <th class="checkbox-column">
              <input type="checkbox" />
              <span class="sort-icon">▼</span>
              <span>Lead name</span>
            </th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Lead Source</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in leads" :key="lead.email">
            <td class="checkbox-column">
              <input type="checkbox" />
              <span>{{ lead.name }}</span>
            </td>
            <td>{{ lead.company }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.phone }}</td>
            <td>{{ lead.source }}</td>
            <td>{{ lead.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="rows-per-page">
        Row per page:
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="pagination">
        <button class="nav-btn">&lt;</button>
        <span class="current-page">1</span>
        <button class="nav-btn">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Lead',
  setup() {
    const router = useRouter()

    const navigateToCreateLead = () => {
      router.push('/leads/create')
    }

    return {
      navigateToCreateLead,
    }
  },
  data() {
    return {
      rowsPerPage: 10,
      leads: [
        {
          name: 'Le Tran Huong Giang',
          company: 'Unitech Dach',
          email: 'hgiang140302@gmail.com',
          phone: '0913283313',
          source: 'Zalo',
          owner: 'Sally Tran',
        },
        {
          name: 'Tran Thanh Nhan',
          company: 'ABeam Consulting Vietnam',
          email: 'thanhnhan@gmail.com',
          phone: '0987654321',
          source: 'Facebook',
          owner: 'Brown Tran',
        },
        {
          name: 'Nguyen Thuc Nhi',
          company: 'TaiChung',
          email: 'ntnhi@gmail.com',
          phone: '0732648338',
          source: 'Wedsite',
          owner: 'Brown Tran',
        },
        {
          name: 'Le Duc Huy',
          company: 'Picon Technology',
          email: 'huyld@gmail.com',
          phone: '0912345678',
          source: 'LinkedIn',
          owner: 'John Smith',
        },
        {
          name: 'Pham Minh Tuan',
          company: 'TechVision Corp',
          email: 'tuanpm@techvision.vn',
          phone: '0934567890',
          source: 'Twitter',
          owner: 'Sarah Wilson',
        },
        {
          name: 'Nguyen Thi Mai Anh',
          company: 'Digital Solutions JSC',
          email: 'maianh.nguyen@digital.com',
          phone: '0978123456',
          source: 'Trade Show',
          owner: 'Mike Johnson',
        },
        {
          name: 'Tran Van Minh',
          company: 'SmartTech Vietnam',
          email: 'minhtr@smarttech.vn',
          phone: '0912876543',
          source: 'Email Campaign',
          owner: 'Emily Davis',
        },
      ],
    }
  },
})
</script>

<style scoped>
.leads-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.leads-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.create-lead-btn {
  background-color: #1a3353;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.actions-btn {
  background-color: #ff4d00;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.leads-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fc;
  font-weight: 500;
  color: #1a3353;
}

.checkbox-column {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  color: #666;
  font-size: 12px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rows-per-page select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.current-page {
  background-color: #1a3353;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
