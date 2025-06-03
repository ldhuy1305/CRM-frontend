<template>
  <div class="default-layout">
    <Header />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import { WebSocketClient } from '@/plugins/websocket'
import { useAuthStore } from '@/stores/modules/auth'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'DefaultLayout',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    // let wsClient: WebSocketClient | null = null

    const wsClient = ref<WebSocketClient | null>(null)

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        await authStore.fetchUser()
      }

      if (!authStore.user?.user?.id) {
        router.push('/login')
      } else {
        wsClient.value = new WebSocketClient(authStore.user.user.id.toString())
        wsClient.value.connect()
      }
    })

    onUnmounted(() => {
      wsClient.value?.disconnect()
    })

    return {}
  },
})
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
