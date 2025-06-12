<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="password-settings">
    <h3>Password Settings</h3>

    <form @submit.prevent="handleChangePassword">
      <div class="password-item" v-for="field in fields" :key="field.id">
        <label class="label" :for="field.id">{{ field.label }}</label>
        <div class="input-wrapper">
          <CRMInput
            :type="'password'"
            :id="field.id"
            v-model="field.model.value"
            required
            :showPassword="field.showPassword"
            @toggle-password="field.showPassword = !field.showPassword"
            :class="{ error: field.error }"
          />
          <div v-if="field.error" class="error-message">
            {{ field.error }}
          </div>
        </div>
      </div>

      <!-- Password Requirements (for new password) -->
      <div v-if="fields[1].model.value" class="password-requirements">
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

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="success-message">
        <fas-icon icon="check-circle" />
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message-box">
        <fas-icon icon="exclamation-triangle" />
        {{ errorMessage }}
      </div>

      <div class="button-wrapper">
        <CRMButton type="submit" @click="handleChangePassword">
          <fas-icon v-if="isLoading" icon="spinner"></fas-icon>
          {{ isLoading ? 'Changing Password...' : 'Change Password' }}
        </CRMButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { authService, type ChangePasswordPayload } from '@/services/repositories/auth'
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import CRMInput from '../ui/CRM-Input.vue'
import CRMButton from '../ui/CRMButton.vue'

const toast = useToast()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fields = reactive([
  {
    id: 'currentPassword',
    label: 'Current Password',
    model: { value: '' },
    showPassword: false,
    error: '',
  },
  {
    id: 'newPassword',
    label: 'New Password',
    model: { value: '' },
    showPassword: false,
    error: '',
  },
  {
    id: 'confirmPassword',
    label: 'Confirm New Password',
    model: { value: '' },
    showPassword: false,
    error: '',
  },
])

// Password validation computed properties
const hasMinLength = computed(() => fields[1].model.value.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(fields[1].model.value))
const hasLowerCase = computed(() => /[a-z]/.test(fields[1].model.value))
const hasNumber = computed(() => /\d/.test(fields[1].model.value))
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(fields[1].model.value),
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

const validateForm = () => {
  let isValid = true

  // Clear previous errors
  fields.forEach((field) => (field.error = ''))
  errorMessage.value = ''

  // Validate current password
  if (!fields[0].model.value) {
    fields[0].error = 'Current password is required'
    isValid = false
  }

  // Validate new password
  if (!fields[1].model.value) {
    fields[1].error = 'New password is required'
    isValid = false
  } else if (!isPasswordValid.value) {
    fields[1].error = 'Password does not meet requirements'
    isValid = false
  }

  // Validate confirm password
  if (!fields[2].model.value) {
    fields[2].error = 'Please confirm your new password'
    isValid = false
  } else if (fields[1].model.value !== fields[2].model.value) {
    fields[2].error = 'Passwords do not match'
    isValid = false
  }

  // Check if new password is same as current password
  if (fields[0].model.value === fields[1].model.value) {
    fields[1].error = 'New password must be different from current password'
    isValid = false
  }

  return isValid
}

const handleChangePassword = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    const payload: ChangePasswordPayload = {
      old_password: fields[0].model.value,
      new_password: fields[1].model.value,
      confirm_password: fields[2].model.value,
    }

    await authService.changePassword(payload)

    // Success
    successMessage.value = 'Password changed successfully!'
    toast.success('Password changed successfully!')

    // Clear form
    fields.forEach((field) => {
      field.model.value = ''
      field.error = ''
    })
  } catch (error: any) {
    console.error('Error changing password:', error)

    // Handle specific error cases
    if (error.message.includes('current password')) {
      fields[0].error = 'Current password is incorrect'
    } else {
      errorMessage.value = error.message || 'Failed to change password. Please try again.'
    }

    toast.error(errorMessage.value || 'Failed to change password')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.password-settings {
  flex: 1;
  padding: 2rem;
  border-radius: 12px;
  color: #1f2937;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 1000;
  background-color: white;
  bottom: 50px;
  width: 87%;
  margin-left: calc(-1 * ((68vw - 97%) / 2));
}

.password-settings h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: black;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.password-item {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #d1d5db;
}

.label {
  width: 30%;
  font-weight: 500;
  color: #333;
  padding-top: 0.75rem;
}

.input-wrapper {
  width: 70%;
}

.password-requirements {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
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
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 12px;
  color: #155724;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.input-wrapper .error {
  border-color: #e74c3c;
}

@media (max-width: 768px) {
  .password-item {
    flex-direction: column;
    align-items: stretch;
  }

  .label {
    width: 100%;
    margin-bottom: 0.5rem;
    padding-top: 0;
  }

  .input-wrapper {
    width: 100%;
  }
}
</style>
