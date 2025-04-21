<template>
  <div class="leads-container">
    <TableHeader :title="Header" @create="navigateToCreateLead" />
    <LeadsTable :leads="leads" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import TableHeader from './TableHeader.vue'
import LeadsTable from './LeadsTable.vue'
import LeadsFooter from './Pagination.vue'

export default defineComponent({
  name: 'Leads',
  components: {
    TableHeader,
    LeadsTable,
    LeadsFooter,
  },
  setup() {
    const router = useRouter()
    const navigateToCreateLead = () => {
      router.push('/leads/create')
    }

    const Header = 'Leads'

    return {
      navigateToCreateLead,
      Header,
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

<style>
.leads-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
}
</style>
