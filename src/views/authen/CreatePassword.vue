<template>
  <div class="create-password-container">
    <div class="create-password-card">
      <div class="card-header">
        <div class="logo-crm">
          <img src="@/assets/unibeam-logo.png" alt="UNIBEAM" class="crm-logo" />
        </div>
        <h2>Create Your Password</h2>
        <p>
          Welcome !<br />
          Create a secure password for your account.
        </p>
      </div>

      <div class="card-body">
        <form @submit.prevent="createPassword">
          <div class="form-group">
            <label for="password">New Password <span class="required">*</span></label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                class="form-input"
                :class="{ error: passwordError }"
                required
              />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <fas-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password <span class="required">*</span></label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your new password"
                class="form-input"
                :class="{ error: confirmPasswordError }"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="confirmPasswordError" class="error-message">
              {{ confirmPasswordError }}
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li :class="{ valid: hasMinLength }">
                <fas-icon :icon="hasMinLength ? 'check' : 'times'" />
                At least 8 characters
              </li>
              <li :class="{ valid: hasUpperCase }">
                <fas-icon :icon="hasUpperCase ? 'check' : 'times'" />
                At least one uppercase letter
              </li>
              <li :class="{ valid: hasLowerCase }">
                <fas-icon :icon="hasLowerCase ? 'check' : 'times'" />
                At least one lowercase letter
              </li>
              <li :class="{ valid: hasNumber }">
                <fas-icon :icon="hasNumber ? 'check' : 'times'" />
                At least one number
              </li>
              <li :class="{ valid: hasSpecialChar }">
                <fas-icon :icon="hasSpecialChar ? 'check' : 'times'" />
                At least one special character
              </li>
            </ul>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid || isLoading">
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              {{ isLoading ? 'Creating Password...' : 'Create Password' }}
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
          <div class="redirect-info">Redirecting to login page in {{ countdown }} seconds...</div>
        </div>

        <!-- Error Message -->
        <div v-if="generalError" class="error-message-box">
          <fas-icon icon="exclamation-triangle" />
          {{ generalError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userRepository } from '@/services'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref({
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const generalError = ref('')
const countdown = ref(5)
const inviteCode = ref('')

// Password validation computed properties
const hasMinLength = computed(() => form.value.password.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(form.value.password))
const hasLowerCase = computed(() => /[a-z]/.test(form.value.password))
const hasNumber = computed(() => /\d/.test(form.value.password))
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.value.password),
)

const isPasswordValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

const passwordError = computed(() => {
  if (!form.value.password) return ''
  if (!isPasswordValid.value) {
    return 'Password does not meet requirements'
  }
  return ''
})

const confirmPasswordError = computed(() => {
  if (!form.value.confirmPassword) return ''
  if (form.value.password !== form.value.confirmPassword) {
    return 'Passwords do not match'
  }
  return ''
})

const isFormValid = computed(() => {
  return (
    form.value.password &&
    form.value.confirmPassword &&
    isPasswordValid.value &&
    form.value.password === form.value.confirmPassword
  )
})

const createPassword = async () => {
  if (!isFormValid.value) {
    generalError.value = 'Please fix the errors above'
    return
  }

  try {
    isLoading.value = true
    generalError.value = ''

    await userRepository.createPassword(inviteCode.value, form.value.password)

    successMessage.value = 'Password created successfully!'

    // Start countdown and redirect
    startCountdown()
  } catch (error: any) {
    console.error('Error creating password:', error)

    if (error.response?.status === 400) {
      generalError.value = 'Invalid or expired invitation link'
    } else if (error.response?.status === 404) {
      generalError.value = 'Invitation not found'
    } else {
      generalError.value = 'Failed to create password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/login')
    }
  }, 1000)
}

const validateInviteCode = () => {
  const code = route.query.p as string
  if (!code) {
    generalError.value = 'Invalid invitation link'
    router.push('/login')
    return
  }
  inviteCode.value = code
}

onMounted(() => {
  validateInviteCode()
})
</script>

<style scoped>
.create-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.create-password-card {
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

.logo-crm h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
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
  padding: 12px 45px 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #ff6500;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
  background: #fdf2f2;
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

.password-requirements {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6500;
}

.password-requirements h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #6c757d;
  transition: color 0.3s ease;
}

.password-requirements li.valid {
  color: #28a745;
}

.password-requirements li i {
  width: 14px;
  font-size: 12px;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-message-box {
  background: #fdf2f2;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 12px;
  color: #721c24;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 15px;
  color: #155724;
  margin-top: 20px;
  text-align: center;
}

.success-message i {
  margin-right: 8px;
  font-size: 18px;
}

.redirect-info {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.form-actions {
  margin-top: 30px;
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
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.crm-logo {
  height: 80px;
  padding: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.crm-logo.rounded-shadow {
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .create-password-container {
    padding: 10px;
  }

  .card-header,
  .card-body {
    padding: 30px 20px;
  }

  .card-header h2 {
    font-size: 20px;
  }
}
</style>
