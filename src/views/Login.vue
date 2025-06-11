<template>
  <div class="login-container">
    <CRMLoading :loading="isLoading" />

    <div class="login-card">
      <!-- Add the same header as CreatePassword page -->
      <div class="card-header">
        <h2>Wellcome to</h2>
        <div class="logo-crm">
          <img src="@/assets/unibeam-logo.png" alt="UNIBEAM" class="crm-logo" />
        </div>
      </div>

      <!-- Login form in card body -->
      <div class="card-body">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="Enter your email"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password <span class="required">*</span></label>
            <div class="password-input-container">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="Enter your password"
                class="form-input"
                required
              />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <fas-icon
                  :icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="password-icon"
                />
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message-box">
            <fas-icon icon="fas fa-exclamation-triangle" />
            {{ error }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <fas-icon v-if="isLoading" icon="spinner"></fas-icon>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password" class="forgot-link">
              Forgot your password?
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { useAuthStore } from '@/stores/modules/auth.ts'
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
    const showPassword = ref(false)

    const form = reactive({
      email: '',
      password: '',
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
      showPassword,
    }
  },
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 480px;
}

.card-header {
  text-align: center;
  padding: 40px 40px 20px;
  background: linear-gradient(100deg, #b0d9eb 0%, #ff6500 100%);
  color: white;
}

.logo-crm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.crm-logo {
  height: 80px;
  padding: 8px;
  transition: all 0.3s ease;
}

.card-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.card-body {
  padding: 40px;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.required {
  color: #e74c3c;
}

.password-input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.password-input-container .form-input {
  padding-right: 45px;
}

.form-input:focus {
  outline: none;
  border-color: #ff6500;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 101, 0, 0.1);
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 5px;
}

.password-toggle:hover {
  color: #495057;
}

.error-message-box {
  background: #fdf2f2;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 12px;
  color: #721c24;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  margin-bottom: 20px;
}

.btn-primary {
  width: 100%;
  background: #ff6500;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 101, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.forgot-password {
  text-align: center;
}

.forgot-link {
  color: #ff6500;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #e55a00;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .card-header,
  .card-body {
    padding: 30px 20px;
  }

  .card-header h2 {
    font-size: 20px;
  }

  .crm-logo {
    height: 60px;
  }
}
</style>
