<script setup lang="ts">
import InfoItem from './InfoItem.vue'
import { ref } from 'vue'

const name = ref('nguyenkhoa-01')
const gender = ref('Not provided')
const location = ref('Your location')
const github = ref('https://github.com/HuuKhoaDev')
</script>

<template>
  <div class="basic-info">
    <h3>Basic Info</h3>
    <InfoItem label="Name" v-model="name" field="name" />
    <InfoItem label="Gender" v-model="gender" field="gender" />
    <InfoItem label="Location" v-model="location" field="location" />
    <InfoItem label="Github" v-model="github" field="github" />
  </div>
</template>

<style scoped>
.basic-info {
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

.basic-info h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: black;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.basic-info :deep(.info-item) {
  margin-bottom: 1rem;
  padding: 1.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d1d5db;
}

.basic-info :deep(.info-item:hover) {
  background-color: #f3f4f6;
}
</style>
