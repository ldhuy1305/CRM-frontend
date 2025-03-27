// src/main.ts
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { pinia } from '@/stores';
import servicesPlugin from '@/plugins/services.ts';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(servicesPlugin);
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});
app.mount('#app');
