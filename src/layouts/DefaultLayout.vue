<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="default-layout">
    <header class="header">
      <h1>CRM System</h1>
      <nav>
        <button @click="logout">Đăng xuất</button>
      </nav>
    </header>
    <aside class="sidebar">
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/customers">Khách hàng</router-link></li>
        <li><router-link to="/tasks">Nhiệm vụ</router-link></li>
        <li><router-link to="/reports">Báo cáo</router-link></li>
      </ul>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultLayout',
  methods: {
    logout() {
      this.$router.push('/login');
    },
  },
});
</script>

<style scoped>
.default-layout {
  display: grid;
  grid-template-areas:
    'header header'
    'sidebar content';
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.header {
  grid-area: header;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar {
  grid-area: sidebar;
  background-color: #34495e;
  color: white;
  padding: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
}

.sidebar a:hover {
  color: #3498db;
}

.content {
  grid-area: content;
  padding: 1rem;
  overflow-y: auto;
}
</style>
