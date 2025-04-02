<template>
  <div class="create-lead-container">
    <div class="create-lead-header">
      <h1>Create Lead</h1>
      <div class="header-actions">
        <button class="cancel-btn" @click="handleCancel">Cancel</button>
        <button class="create-new-btn">Create & New</button>
        <button class="create-btn">Create</button>
      </div>
    </div>

    <div class="form-container">
      <div class="information-section">
        <h2>Information</h2>
        <div class="avatar-section">
          <div class="avatar-placeholder">
            <img src="@/assets/user-avatar.png" alt="Lead Avatar" />
          </div>
          <span class="edit-avatar">Edit avatar</span>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="form.firstName" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="form.lastName" />
          </div>
          <div class="form-group">
            <label>Company</label>
            <input type="text" v-model="form.company" />
          </div>
          <div class="form-group">
            <label>Lead Owner</label>
            <select v-model="form.leadOwner">
              <option value="">Select Owner</option>
              <option value="sally">Sally Trần</option>
              <option value="brown">Brown Trần</option>
            </select>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" v-model="form.phone" />
          </div>
          <div class="form-group">
            <label>Website</label>
            <input type="url" v-model="form.website" />
          </div>
          <div class="form-group">
            <label>Fax</label>
            <input type="tel" v-model="form.fax" />
          </div>
          <div class="form-group">
            <label>Lead Source</label>
            <select v-model="form.leadSource">
              <option value="">Select Source</option>
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="zalo">Zalo</option>
            </select>
          </div>
          <div class="form-group">
            <label>Lead Status</label>
            <select v-model="form.leadStatus">
              <option value="">Select Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
          </div>
          <div class="form-group">
            <label>Industry</label>
            <select v-model="form.industry">
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>
          <div class="form-group">
            <label>Annual Revenue</label>
            <input type="number" v-model="form.annualRevenue" />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.callOptOut" />
              Call Opt Out
            </label>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.emailOptOut" />
              Email Opt Out
            </label>
          </div>
        </div>
      </div>

      <div class="address-section">
        <h2>Address Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Street</label>
            <input type="text" v-model="form.street" />
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="form.city" />
          </div>
          <div class="form-group">
            <label>Province</label>
            <input type="text" v-model="form.province" />
          </div>
          <div class="form-group">
            <label>Postal code</label>
            <input type="text" v-model="form.postalCode" />
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="form.country" />
          </div>
        </div>
      </div>

      <div class="description-section">
        <h2>Description Information</h2>
        <div class="form-group">
          <textarea v-model="form.description" rows="6"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CreateLeadView',
  setup() {
    const router = useRouter()
    const form = reactive({
      firstName: '',
      lastName: '',
      company: '',
      leadOwner: '',
      email: '',
      phone: '',
      website: '',
      fax: '',
      leadSource: '',
      leadStatus: '',
      industry: '',
      annualRevenue: '',
      callOptOut: false,
      emailOptOut: false,
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      description: '',
    })

    const handleCancel = () => {
      router.push('/leads')
    }

    return {
      form,
      handleCancel,
    }
  },
})
</script>

<style scoped>
.create-lead-container {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.create-lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  background-color: #ff4d4d;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.create-new-btn {
  background-color: #ff4d00;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.create-btn {
  background-color: #1a3353;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.form-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.information-section,
.address-section,
.description-section {
  margin-bottom: 32px;
}

h2 {
  color: #1a3353;
  margin-bottom: 20px;
  font-size: 1.2em;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-bottom: 8px;
  overflow: hidden;
}

.avatar-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  color: #1a3353;
  cursor: pointer;
  font-size: 0.9em;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #666;
  font-size: 0.9em;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.description-section textarea {
  width: 100%;
  resize: vertical;
}
</style>
