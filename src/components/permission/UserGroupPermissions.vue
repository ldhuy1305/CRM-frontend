<template>
  <div class="user-page">
    <div class="stepper">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="step-item"
        :class="{ active: currentStep === index + 1 }"
      >
        <div class="step-circle">{{ index + 1 }}</div>
        <span class="step-label">{{ step }}</span>
      </div>
    </div>

    <div v-if="currentStep === 1" class="card">
      <h3 class="card-title">Set User Details</h3>
      <p class="card-subtitle">
        You can add multiple users at once with the same access type and permissions.
      </p>

      <div class="section-box">
        <h4 class="section-title">Select Users from Existing Table</h4>
        <UserSelectTable @add-users="handleSelectedUsers" />
      </div>

      <div class="access-section">
        <h3 class="access-title">Access Type</h3>
        <p class="access-description">
          AWS Looker System access. Enables a password that allows user to sign in to the AWS Looker
          System
        </p>

        <div class="access-radio-group">
          <label class="access-radio-label">
            <CRMInput type="radio" value="auto" v-model="passwordType" /> autogerated password
          </label>
          <label class="access-radio-label">
            <CRMInput type="radio" value="custom" v-model="passwordType" /> custom password
          </label>
        </div>

        <div v-if="passwordType === 'custom'" class="custom-password-section">
          <span class="custom-password-label">Custom password</span>
          <CRMInput
            v-model="customPassword"
            placeholder="Custom Password"
            class="custom-password-input"
            type="password"
            :showPassword="field.showPassword"
          @toggle-password="field.showPassword = !field.showPassword"
          />
          <label class="access-checkbox-label">
            <CRMInput type="checkbox" v-model="requireReset" /> Require password reset
          </label>
        </div>
      </div>
    </div>

    <SetPermissions
      v-if="currentStep === 2"
      :role="role"
      :permissions="permissions"
      @update:role="(val) => (role = val)"
      @update:permissions="(val) => (permissions = val)"
      @update:selectedPermissions="(val) => (selectedPermissions = val)"
    />

    <ReviewUsers
      v-if="currentStep === 3"
      :users="users"
      :selectedPermissions="selectedPermissions"
    />

    <div class="footer">
      <CRMButton class="btn-cancel" @click="goBack" :disabled="currentStep === 1">Back</CRMButton>
      <CRMButton class="btn-next" @click="goNext">
        {{ currentStep < steps.length ? 'Next ➜' : 'Finish' }}
      </CRMButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CRMInput from '../ui/CRM-Input.vue'
import CRMButton from '../ui/CRMButton.vue'
import SetPermissions from './SetPermissions.vue'
import ReviewUsers from './ReviewUsers.vue'
import UserSelectTable from './UserSelectTable.vue'

interface User {
  name: string
  position: string
  email: string
}

const steps = ['Set Details', 'Set Permissions', 'Review']
const currentStep = ref<number>(1)

const users = reactive<User[]>([
  { name: '', position: '', email: '' },
  { name: '', position: '', email: '' },
])

const addUser = (): void => {
  users.push({ name: '', position: '', email: '' })
}

const passwordType = ref<'auto' | 'custom'>('custom')
const customPassword = ref<string>('')
const requireReset = ref<boolean>(false)
const field = reactive({
  showPassword: false,
})

const role = ref<string>('')
const permissions = ref<string>('')
const selectedPermissions = ref<string[]>([])

const goNext = (): void => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    // TODO: handle Finish action (e.g., submit data)
  }
}

const goBack = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSelectedUsers = (selected: User[]): void => {
  selected.forEach((user) => {
    users.push({
      name: user.name,
      position: '',
      email: user.email,
    })
  })
}
</script>

<style scoped>
.user-page {
  max-width: 900px;
  margin: auto;
  padding: 32px;
  font-family: sans-serif;
}

.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #d1d5db;
  z-index: 0;
}

.step-item:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 15px;
  right: 50%;
  width: 40px;
  height: 2px;
  background-color: #d1d5db;
  z-index: 0;
}

.step-item.active ~ .step-item::before {
  background-color: #d1d5db;
}

.step-item.active::after {
  background-color: #3b82f6;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #9b9b9b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  background: white;
  color: black;
  font-weight: bold;
  z-index: 1002;
}

.step-item.active .step-circle {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.step-label {
  font-size: 14px;
  color: black;
}

.step-item.active .step-label {
  font-weight: bold;
  color: #3b82f6;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.card-title {
  font-size: 20px;
  color: #000;
  margin-bottom: 10px;
}

.card-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.user-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-row input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  margin-bottom: 4px;
  color: #374151;
}

.required {
  color: red;
  font-size: 16px;
}

.btn-add-user {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

.btn-remove-user {
  background-color: transparent;
  border: none;
  color: #000;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  margin-top: 30px;
}

.btn-remove-user:hover {
  color: #d70000;
}

.access-section {
  margin-top: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.access-title {
  font-size: 20px;
  margin-bottom: 4px;
  color: #1f2937;
}

.access-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.access-radio-group {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.access-radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.custom-password-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-password-label {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.custom-password-input {
  width: 50%;
  max-width: 300px;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.access-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 20px;
}

.btn-cancel,
.btn-next {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancel {
  background: none;
  color: white;
  background: #0b192c;
}

.btn-next {
  background: #3b82f6;
  color: white;
}

.section-box {
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
}
</style>
