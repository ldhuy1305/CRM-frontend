<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import { computed, ref } from 'vue'
import CRMButton from '../ui/CRMButton.vue'
import BasicInfo from './BasicInfo.vue'
import Password from './Password.vue'
import Sidebar from './Sidebar.vue'

const selectedTab = ref('basic')
const authStore = useAuthStore()

const profileData = ref({
  first_name: '',
  last_name: '',
  address: '',
  phone: '',
  permissions: [] as string[],
})

type ProfileField = keyof typeof profileData.value

function updateProfileField(field: ProfileField, value: any) {
  profileData.value[field] = value
}

const currentComponent = computed(() => {
  switch (selectedTab.value) {
    case 'password':
      return Password
    default:
      return BasicInfo
  }
})

const defaultAvatarUrl =
  'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png'
const getAvatarUrl = (): string => {
  return authStore.user?.user.avatar || defaultAvatarUrl
}
const avatarUrl = ref<string>(getAvatarUrl())

const isZoomed = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const showAvatarMenu = ref(false)

function toggleAvatarMenu() {
  showAvatarMenu.value = !showAvatarMenu.value
}

function onAvatarSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      avatarUrl.value = reader.result as string

      showAvatarMenu.value = false
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img :src="avatarUrl" alt="avatar" class="avatar" @click="isZoomed = true" />
        <font-awesome-icon
          :icon="['fas', 'pen-to-square']"
          class="edit-avatar-icon"
          @click="toggleAvatarMenu"
        />
        <div v-if="showAvatarMenu" class="avatar-menu">
          <div class="avatar-menu-arrow"></div>
          <CRMButton @click="fileInput?.click()">Upload a photo…</CRMButton>
        </div>

        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="onAvatarSelected"
        />
      </div>
    </div>

    <div class="profile-body">
      <Sidebar :selectedTab="selectedTab" @selectTab="selectedTab = $event" />
      <div class="profile-content">
        <component :is="currentComponent" @update-field="updateProfileField" />
        <!-- <pre>{{ profileData }}</pre> -->
      </div>
    </div>

    <div class="zoom-modal" v-if="isZoomed" @click.self="isZoomed = false">
      <img :src="avatarUrl" class="zoomed-avatar" />
      <CRMButton class="close-btn" @click="isZoomed = false">×</CRMButton>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  padding: 2rem 10rem;
  background: #f5f5f5;
  color: white;
  width: 100vw;
  margin-left: calc(-1 * ((100vw - 100%) / 2));
  margin-right: calc(-1 * ((100vw - 100%) / 2));
  margin-top: -20px;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: -10px;
}

.user-info p {
  opacity: 0.4;
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.user-info h2,
.user-info p {
  margin-left: 40px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: zoom-in;
}

.edit-avatar-icon {
  position: absolute;
  bottom: -16px;
  left: 2px;
  font-size: 18px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  color: #333;
  transition:
    background 0.2s,
    color 0.2s;
}

.edit-avatar-icon:hover {
  background: #e0e0e0;
  color: #000;
}

.profile-body {
  display: flex;
  margin-top: 1.5rem;
  gap: 2rem;
}

.profile-content {
  flex: 1;
}

.avatar-menu {
  position: absolute;
  margin-top: 25px;
  left: -15px;
  background-color: #1f1f1f;
  color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  width: 180px;
  font-size: 14px;
  border: 1px solid #333;
}

.avatar-menu button {
  background: transparent;
  border: none;
  padding: 8px 16px;
  text-align: left;
  cursor: pointer;
  color: white;
}

.avatar-menu button:hover {
  background-color: #333;
}

.avatar-menu-arrow {
  position: absolute;
  top: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #1f1f1f;
}

.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoomed-avatar {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .profile-body {
    flex-direction: column;
  }
}
</style>
