<template>
  <div class="forgot-password-container">
    <CRMLoading :loading="isLoading" />

    <div class="forgot-password-card">
      <div class="card-header">
        <div class="logo-crm">
          <img src="@/assets/unibeam-logo.png" alt="UNIBEAM" class="crm-logo" />
        </div>
        <h2>Forgot Password?</h2>
        <p>
          Don't worry!<br />
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div class="card-body">
        <!-- Email Form -->
        <form v-if="!emailSent" @submit.prevent="sendResetLink">
          <div class="form-group">
            <label for="email">Email Address <span class="required">*</span></label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email address"
              class="form-input"
              :class="{ error: emailError }"
              required
            />
            <div v-if="emailError" class="error-message">
              <fas-icon icon="exclamation-triangle" />
              {{ emailError }}
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid || isLoading">
              <fas-icon v-if="isLoading" icon="spinner"></fas-icon>
              {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </div>

          <div class="back-to-login">
            <router-link to="/login" class="back-link">
              <fas-icon icon="arrow-left" />
              Back to Login
            </router-link>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="emailSent" class="success-container">
          <div class="success-icon">
            <fas-icon icon="envelope" />
          </div>
          <h3>Check Your Email</h3>
          <p class="success-description">
            We've sent a password reset link to:<br />
            <strong>{{ form.email }}</strong>
          </p>
          <p class="success-instructions">
            Click the link in your email to reset your password. If you don't see it, check your
            spam folder.
          </p>

          <div class="success-actions">
            <button @click="resendEmail" class="btn-secondary" :disabled="resendCooldown > 0">
              <fas-icon v-if="isResending" icon="spinner"></fas-icon>
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email' }}
            </button>
            <router-link to="/login" class="btn-primary"> Back to Login </router-link>
          </div>
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
import CRMLoading from '@/components/ui/CRM-Loading.vue'
import { authService } from '@/services/repositories/auth'
import { computed, ref } from 'vue'

const form = ref({
  email: '',
})

const isLoading = ref(false)
const isResending = ref(false)
const emailSent = ref(false)
const generalError = ref('')
const emailError = ref('')
const resendCooldown = ref(0)

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.value.email)
})

const isFormValid = computed(() => {
  return form.value.email && isValidEmail.value
})

// Validate email on input
const validateEmail = () => {
  if (!form.value.email) {
    emailError.value = ''
    return
  }

  if (!isValidEmail.value) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const sendResetLink = async () => {
  validateEmail()

  if (!isFormValid.value) {
    generalError.value = 'Please enter a valid email address'
    return
  }

  try {
    isLoading.value = true
    generalError.value = ''

    // Call the forgot password API
    await authService.forgotPassword({ email: form.value.email })

    emailSent.value = true
    startResendCooldown()
  } catch (error: any) {
    console.error('Error sending reset link:', error)

    if (error.response?.status === 404) {
      generalError.value = 'No account found with this email address'
    } else if (error.response?.status === 429) {
      generalError.value = 'Too many requests. Please try again later.'
    } else if (error.response?.status === 400) {
      generalError.value = 'Invalid email address'
    } else {
      generalError.value = 'Failed to send reset link. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return

  try {
    isResending.value = true
    generalError.value = ''

    await authService.forgotPassword({ email: form.value.email })

    startResendCooldown()
  } catch (error: any) {
    console.error('Error resending email:', error)
    generalError.value = 'Failed to resend email. Please try again.'
  } finally {
    isResending.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60 // 60 seconds cooldown
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.forgot-password-card {
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
  line-height: 1.5;
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

.form-input:focus {
  outline: none;
  border-color: #ff6500;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 101, 0, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
  background: #fdf2f2;
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
  text-decoration: none;
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

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  width: 100%;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

.back-link {
  color: #ff6500;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.back-link:hover {
  text-decoration: underline;
}

/* Success Container Styles */
.success-container {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6500, #e55a00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
}

.success-container h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.success-description {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.success-description strong {
  color: #ff6500;
  font-weight: 600;
}

.success-instructions {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 480px) {
  .forgot-password-container {
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

  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .success-container h3 {
    font-size: 20px;
  }
}
</style>
