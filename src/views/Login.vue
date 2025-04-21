<template>
  <div>
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
      <button type="submit" :disabled="loading">Đăng nhập</button>
      <p>
        Quên mật khẩu?
               <!-- <router-link to="/email">Đăng ký</router-link> -->
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/modules/auth.ts'
import '@/styles/login/style.css'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const form = reactive({
      email: 'Admin001@gmail.com',
      password: 'Admin001@',
    })

    const handleLogin = async () => {
      try {
        await authStore.login(form, router)
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    return {
      form,
      handleLogin,
      error: authStore.error,
    }
  },
})
</script>
