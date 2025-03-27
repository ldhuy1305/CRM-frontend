<template>
  <div class="default-layout">
    <Header />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layout/Header.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Header,
  },
});
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
