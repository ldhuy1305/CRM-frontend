<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from './Sidebar.vue'
import BasicInfo from './BasicInfo.vue'
import Password from './Password.vue'
import CRMButton from '../ui/CRMButton.vue'

const selectedTab = ref('basic')

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

const avatarUrl = ref<string>(
  'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-1/474608916_2015410792297042_2457717296624445349_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=x-t9HDIjVvMQ7kNvwFnCgVT&_nc_oc=AdkNut4W1KMuT0bx2crZYLF4C2r49qcEAo4GdAY473lxSbzi3iK3wIIefCw38zfDu0w&_nc_zt=24&_nc_ht=scontent.fdad3-1.fna&_nc_gid=mkXW194MvJzdefBXmUzy3Q&oh=00_AfISo2UZW8F-jh0HpqPoA369Za9tHM7JTKIZhJCSmD4ucQ&oe=68288690',
)

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

      <div class="user-info">
        <h2>Nguyen Huu Khoa</h2>
        <p>LeetCode ID: nguyenkhoa-01</p>
      </div>
    </div>

    <div class="profile-body">
      <Sidebar :selectedTab="selectedTab" @selectTab="selectedTab = $event" />
      <div class="profile-content">
        <component :is="currentComponent" @update-field="updateProfileField" />
        <pre>{{ profileData }}</pre>
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
  background: linear-gradient(to right, #2d2d2d, #1a1a1a);
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
  border-radius: 12px;
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
