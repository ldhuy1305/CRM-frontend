<template>
  <div class="security-info">
    <h2 class="section-title">Security Info</h2>

    <div class="password-toggle">
      <InfoItem label="Password" :value="'********'" field="password" />
    </div>

    <InfoItem label="Two-Factor Auth" value="Enabled" field="twoFactorAuth" />
  </div>
</template>

<script lang="ts" setup>
import InfoItem from './InfoItem.vue'
</script>

<style scoped>
.security-info {
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

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

.password-toggle {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  /* border-bottom: 1px solid #e5e7eb; */
  color: black;
}
</style>
