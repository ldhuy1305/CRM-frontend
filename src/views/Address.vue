<template>
  <div class="address-section">
    <h2>Address Information</h2>
    <div class="form-grid">
      <AddressField v-model="form.street" label="Street" placeholder="Enter street" />
      <AddressField v-model="form.city" label="City" placeholder="Enter city" />
      <AddressField v-model="form.province" label="Province" placeholder="Enter province" />
      <AddressField v-model="form.postalCode" label="Postal code" placeholder="Enter postal code" />
      <AddressField v-model="form.country" label="Country" placeholder="Enter country" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AddressField from './AddressField.vue'

defineProps<{ form: any }>()
</script>

<style scoped>
.address-section {
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  background-color: #fff; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.address-section h2 {
  color: #2c3e50;
  font-size: 1.6rem; 
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #3498db; 
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
</style>
