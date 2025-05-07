import type { App } from 'vue'
import type { ServiceFactory } from '@/services'
import { initServices } from '@/services'

export default {
  install: (app: App) => {
    app.config.globalProperties.$services = initServices()
  },
}

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $services: ServiceFactory
//   }
// }
