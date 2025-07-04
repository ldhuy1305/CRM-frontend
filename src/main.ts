// src/main.ts
import App from '@/App.vue'
import servicesPlugin from '@/plugins/services.ts'
import router from '@/router'
import { pinia } from '@/stores'
import { useAuthStore } from '@/stores/modules/auth'
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
library.add(fas, far)
const initialize = async () => {
  const app = createApp(App)
  app.use(router)
  app.use(pinia)
  app.use(servicesPlugin)
  app.component('fas-icon', FontAwesomeIcon)
  app.use(Toast, {
    position: 'bottom-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: false,
  })

  app.component('font-awesome-icon', FontAwesomeIcon)

  const authStore = useAuthStore()
  await authStore.initialize()

  app.mount('#app')
}

initialize()
