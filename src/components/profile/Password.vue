<template>
  <div class="password-settings">
    <h2 class="title">Password Settings</h2>
    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div v-for="field in fields" :key="field.id" class="form-group">
          <label :for="field.id">{{ field.label }}</label>
          <CRMInput
            :type="'password'"
            :id="field.id"
            v-model="field.model"
            required
            :showPassword="field.showPassword"
            @toggle-password="field.showPassword = !field.showPassword"
          />
        </div>
        <CRMButton @click="handleChangePassword">Change Password</CRMButton>
      </form>
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

const handleSubmit = () => {
  if (fields[1].model !== fields[2].model) {
    alert('Passwords do not match!')
    return
  }
  alert('Password changed successfully!')
}
const handleChangePassword = () => {
  console.log('Change password clicked!')
}
</script>

<style scoped>
.password-settings {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 12px;
  color: #1f2937;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 1000;
  background-color: white;
  bottom: 50px;
  width: 87%;
  margin-left: calc(-1 * ((37vw - 100%) / 2));
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
}

.description {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}
</style>
