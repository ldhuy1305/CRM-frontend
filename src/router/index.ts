
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/modules/auth.ts'

const routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: 'Đăng nhập CRM' },
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
