<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import { onMounted, ref, watch } from 'vue'
import InfoItem from './InfoItem.vue'

const authStore = useAuthStore()

const emit = defineEmits<{
  (e: 'update-field', field: string, value: any): void
}>()

// Reactive refs for user data
const first_name = ref('')
const last_name = ref('')
const address = ref('')
const phone = ref('')

// Load user data from auth store
const loadUserData = () => {
  if (authStore.user) {
    console.log('Loading user data from store:', authStore.user)
    first_name.value = authStore.user.user.first_name
    last_name.value = authStore.user.user.last_name
    address.value = authStore.user.user.address || ''
    phone.value = authStore.user.user.phone || ''
  }
}

// Watch for changes and emit updates
watch(first_name, (val) => emit('update-field', 'first_name', val))
watch(last_name, (val) => emit('update-field', 'last_name', val))
watch(address, (val) => emit('update-field', 'address', val))
watch(phone, (val) => emit('update-field', 'phone', val))

// Watch for user data changes in store
watch(
  () => authStore.user,
  () => {
    loadUserData()
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="basic-info">
    <h3>Basic Info</h3>
    <InfoItem label="First Name" v-model="first_name" field="first_name" />
    <InfoItem label="Last Name" v-model="last_name" field="last_name" />
    <InfoItem label="Address" v-model="address" field="address" />
    <InfoItem label="Phone" v-model="phone" field="phone" />
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
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d1d5db;
}

.basic-info :deep(.info-item:hover) {
  background-color: #f3f4f6;
}
</style>
