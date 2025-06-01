<template>
  <div>
    <CRMLoading :loading="isLoading" />
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="form.email" type="text" id="email" placeholder="Nhập email" required />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="isLoading">Đăng nhập</button>
      <p class="forgot-password">
        Quên mật khẩu?
        <!--        <router-link to="/email">Đăng ký</router-link>-->
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { useAuthStore } from '@/stores/modules/auth.ts'
import '@/styles/login/style.css'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: {
    CRMLoading,
  },
  setup() {
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const router = useRouter()
    const form = reactive({
      email: 'Admin001@gmail.com',
      password: 'Admin001@',
    })

    const handleLogin = async () => {
      try {
        isLoading.value = true
        await authStore.login(form, router)
      } catch (error) {
        console.error('Login failed:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      handleLogin,
      error: authStore.error,
      isLoading,
    }
  },
})
</script>
