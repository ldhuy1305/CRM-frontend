<template>
  <div class="not-found">
    <div class="overlay">
      <div class="content">
        <h1>404 ERROR!</h1>
        <p>Sorry, the page not found</p>
        <router-link class="home-link" to="/">BACK TO HOME</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/404-background.png'); 
  background-size: cover; 
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background-color: rgba(255, 255, 255, 0.7); 
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
 
}

h1 {
  font-size: 40px;
  color: #ff6600;
  margin: 0;
}

p {
  font-size: 16px;
  color: #666;
  margin: 10px 0 20px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #1a3353;
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #e65100;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
