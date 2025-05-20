<template>
  <div class="password-settings">
    <h3>Password Settings</h3>
    <div class="password-item" v-for="field in fields" :key="field.id">
      <label class="label" :for="field.id">{{ field.label }}</label>
      <div class="input-wrapper">
        <CRMInput
          :type="'password'"
          :id="field.id"
          v-model="field.model"
          required
          :showPassword="field.showPassword"
          @toggle-password="field.showPassword = !field.showPassword"
        />
      </div>
    </div>
    <div class="button-wrapper">
      <CRMButton @click="handleChangePassword">Change Password</CRMButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CRMInput from '../ui/CRM-Input.vue'
import CRMButton from '../ui/CRMButton.vue'

const fields = reactive([
  {
    id: 'currentPassword',
    label: 'Current Password',
    model: ref(''),
    showPassword: false,
  },
  {
    id: 'newPassword',
    label: 'New Password',
    model: ref(''),
    showPassword: false,
  },
  {
    id: 'confirmPassword',
    label: 'Confirm New Password',
    model: ref(''),
    showPassword: false,
  },
])

const handleChangePassword = () => {
  if (fields[1].model !== fields[2].model) {
    alert('Passwords do not match!')
    return
  }
  alert('Password changed successfully!')
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
  align-items: center;
  border-bottom: 1px solid #d1d5db;
}

.label {
  width: 30%;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  width: 70%;
}

.button-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end; 
}
</style>
