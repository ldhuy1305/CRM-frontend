<template>
  <div class="reset-password-container">
    <CRMLoading :loading="isLoading" />

    <div class="reset-password-card">
      <div class="card-header">
        <div class="logo-crm">
          <img src="@/assets/unibeam-logo.png" alt="UNIBEAM" class="crm-logo" />
        </div>
        <h2>Reset Your Password</h2>
        <p>
          Create a new password for your account.<br />
          Make sure it's strong and secure.
        </p>
      </div>

      <div class="card-body">
        <!-- Reset Form -->
        <form v-if="!passwordReset && isValidToken" @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="newPassword">New Password <span class="required">*</span></label>
            <div class="password-input-container">
              <input
                id="newPassword"
                v-model="form.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                class="form-input"
                :class="{ error: errors.newPassword }"
                @input="validateNewPassword"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showNewPassword = !showNewPassword"
              >
                <fas-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <div v-if="errors.newPassword" class="error-message">
              <fas-icon icon="exclamation-triangle" />
              {{ errors.newPassword }}
            </div>
            <!-- Password strength indicator -->
            <div v-if="form.newPassword" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
              <span class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword"
              >Confirm New Password <span class="required">*</span></label
            >
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your new password"
                class="form-input"
                :class="{ error: errors.confirmPassword }"
                @input="validateConfirmPassword"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <fas-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="error-message">
              <fas-icon icon="exclamation-triangle" />
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid || isLoading">
              <fas-icon v-if="isLoading" icon="spinner"></fas-icon>
              {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="passwordReset" class="success-container">
          <div class="success-icon">
            <fas-icon icon="check-circle" />
          </div>
          <h3>Password Reset Successfully!</h3>
          <p class="success-description">
            Your password has been updated successfully.<br />
            You can now login with your new password.
          </p>

          <div class="success-actions">
            <router-link to="/login" class="btn-primary"> Continue to Login </router-link>
          </div>
        </div>

        <!-- Invalid Token Message -->
        <div v-if="!isValidToken && !isLoading" class="error-container">
          <div class="error-icon">
            <fas-icon icon="exclamation-triangle" />
          </div>
          <h3>Invalid or Expired Link</h3>
          <p class="error-description">
            This password reset link is invalid or has expired.<br />
            Please request a new password reset link.
          </p>

          <div class="error-actions">
            <router-link to="/forgot-password" class="btn-primary"> Request New Link </router-link>
            <router-link to="/login" class="btn-secondary"> Back to Login </router-link>
          </div>
        </div>

        <!-- General Error Message -->
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
import { authService, type ResetPasswordPayload } from '@/services/repositories/auth'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const form = ref({
  newPassword: '',
  confirmPassword: '',
})

const errors = ref({
  newPassword: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const passwordReset = ref(false)
const generalError = ref('')
const isValidToken = ref(true)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Extract token and uidb64 from URL
const uidb64 = ref('')
const token = ref('')

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.newPassword
  if (!password) return { class: '', text: '', percentage: 0 }

  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) score += 25
  else feedback.push('at least 8 characters')

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25
  else feedback.push('uppercase letter')

  // Lowercase check
  if (/[a-z]/.test(password)) score += 25
  else feedback.push('lowercase letter')

  // Number or special character check
  if (/[\d\W]/.test(password)) score += 25
  else feedback.push('number or special character')

  if (score < 50) {
    return { class: 'weak', text: 'Weak', percentage: score }
  } else if (score < 75) {
    return { class: 'medium', text: 'Medium', percentage: score }
  } else if (score < 100) {
    return { class: 'strong', text: 'Strong', percentage: score }
  } else {
    return { class: 'very-strong', text: 'Very Strong', percentage: score }
  }
})

const validateNewPassword = () => {
  const password = form.value.newPassword

  if (!password) {
    errors.value.newPassword = ''
    return
  }

  if (password.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters long'
    return
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.value.newPassword = 'Password must contain at least one lowercase letter'
    return
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.value.newPassword = 'Password must contain at least one uppercase letter'
    return
  }

  if (!/(?=.*[\d\W])/.test(password)) {
    errors.value.newPassword = 'Password must contain at least one number or special character'
    return
  }

  errors.value.newPassword = ''

  // Re-validate confirm password if it exists
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = ''
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = ''
  }
}

const isFormValid = computed(() => {
  return (
    form.value.newPassword &&
    form.value.confirmPassword &&
    !errors.value.newPassword &&
    !errors.value.confirmPassword &&
    form.value.newPassword === form.value.confirmPassword &&
    passwordStrength.value.percentage >= 75 // Require strong password
  )
})

const resetPassword = async () => {
  // Final validation
  validateNewPassword()
  validateConfirmPassword()

  if (!isFormValid.value) {
    generalError.value = 'Please fix the errors above'
    return
  }

  try {
    isLoading.value = true
    generalError.value = ''

    const payload: ResetPasswordPayload = {
      uuid_b64: uidb64.value,
      token: token.value,
      password: form.value.newPassword,
    }

    console.log('Reset password payload:', payload)

    await authService.resetPassword(payload)

    passwordReset.value = true
  } catch (error: any) {
    console.error('Error resetting password:', error)

    if (error.response?.status === 400) {
      const errorData = error.response.data
      if (errorData?.token) {
        generalError.value = 'Invalid or expired reset link'
        isValidToken.value = false
      } else if (errorData?.password) {
        errors.value.newPassword = Array.isArray(errorData.password)
          ? errorData.password.join(', ')
          : errorData.password
      } else {
        generalError.value = errorData?.message || 'Invalid request'
      }
    } else if (error.response?.status === 404) {
      generalError.value = 'Reset link not found'
      isValidToken.value = false
    } else if (error.response?.status === 410) {
      generalError.value = 'Reset link has expired'
      isValidToken.value = false
    } else {
      generalError.value = error.message || 'Failed to reset password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const extractTokenFromUrl = () => {
  // Extract uidb64 and token from URL query parameters
  uidb64.value = (route.query.uidb64 as string) || ''
  token.value = (route.query.token as string) || ''

  console.log('Extracted from URL:', { uidb64: uidb64.value, token: token.value })

  // Validate that we have both parameters
  if (!uidb64.value || !token.value) {
    isValidToken.value = false
    generalError.value = 'Invalid reset link. Missing required parameters.'
  }
}

onMounted(() => {
  extractTokenFromUrl()
})
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.reset-password-card {
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

.password-input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 50px 12px 15px;
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

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  font-size: 16px;
  padding: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #ff6500;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #e74c3c;
}

.strength-fill.medium {
  background: #f39c12;
}

.strength-fill.strong {
  background: #27ae60;
}

.strength-fill.very-strong {
  background: #16a085;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
}

.strength-text.weak {
  color: #e74c3c;
}

.strength-text.medium {
  color: #f39c12;
}

.strength-text.strong {
  color: #27ae60;
}

.strength-text.very-strong {
  color: #16a085;
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
  box-sizing: border-box;
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
  width: 100%;
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
  text-decoration: none;
  box-sizing: border-box;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Success Container Styles */
.success-container {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #27ae60, #229954);
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
  margin-bottom: 30px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Error Container Styles */
.error-container {
  text-align: center;
  padding: 20px 0;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
}

.error-container h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.error-description {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 480px) {
  .reset-password-container {
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

  .success-icon,
  .error-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .success-container h3,
  .error-container h3 {
    font-size: 20px;
  }
}
</style>
