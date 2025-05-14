<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from './Sidebar.vue'
import BasicInfo from './BasicInfo.vue'
import AccountProfile from './AccountProfile.vue'
import Password from './Password.vue'
import SecurityInfo from './SecurityInfo.vue'

const selectedTab = ref('basic')

const currentComponent = computed(() => {
  switch (selectedTab.value) {
    case 'account':
      return AccountProfile
    case 'password':
      return Password
    case 'security':
      return SecurityInfo
    default:
      return BasicInfo
  }
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <img
        src="https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-1/474608916_2015410792297042_2457717296624445349_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=x-t9HDIjVvMQ7kNvwFnCgVT&_nc_oc=AdkNut4W1KMuT0bx2crZYLF4C2r49qcEAo4GdAY473lxSbzi3iK3wIIefCw38zfDu0w&_nc_zt=24&_nc_ht=scontent.fdad3-1.fna&_nc_gid=mkXW194MvJzdefBXmUzy3Q&oh=00_AfISo2UZW8F-jh0HpqPoA369Za9tHM7JTKIZhJCSmD4ucQ&oe=68288690"
        alt="avatar"
        class="avatar"
      />
      <div class="user-info">
        <h2>Nguyen Huu Khoa</h2>
        <p>LeetCode ID: nguyenkhoa-01</p>
      </div>
    </div>

    <div class="profile-body">
      <Sidebar :selectedTab="selectedTab" @selectTab="selectedTab = $event" />
      <div class="profile-content">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  padding: 3rem 10rem;
  background: linear-gradient(to right, #2d2d2d, #1a1a1a);
  color: white;
  width: 100vw;
  margin-left: calc(-1 * ((100vw - 100%) / 2));
  margin-right: calc(-1 * ((100vw - 100%) / 2));
  margin-top: -20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-right: 1rem;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.profile-body {
  display: flex;
  margin-top: 1.5rem;
  gap: 2rem;
}

.profile-content {
  flex: 1;
}

@media (max-width: 768px) {
  .profile-body {
    flex-direction: column;
  }
}
</style>
