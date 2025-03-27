<template>
  <div>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="form.email"
          type="text"
          id="email"
          placeholder="Nhập email"
          required
        />
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
        Chưa có tài khoản?
<!--        <router-link to="/email">Đăng ký</router-link>-->
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useAuthStore } from '@/stores/modules/auth.ts';import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const form = reactive({
      email: "ldhuydn1305@gmail.com",
      password: "Ldhuy1305!"
    });

    const handleLogin = async () => {
      try {
        await authStore.login(form);
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return {
      form,
      handleLogin,
      error: authStore.error,
    };
  },
});
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.75rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin: 0.5rem 0;
}

a {
  color: #3498db;
  text-decoration: none;
}
</style>
