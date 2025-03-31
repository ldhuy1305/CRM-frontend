<template>
  <div class="auth-layout">
    <header class="auth-header">
      <!-- <h2>{{ title }}</h2> -->
      <img src="@/assets/unibeam-logo.png" alt="UNIBEAM" class="auth-logo" />
    </header>
    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',
})
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-header {
  margin-bottom: 2rem;
}

.auth-logo {
  width: 200px;
  height: 50px;
  object-fit: contain;
}

.auth-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>
