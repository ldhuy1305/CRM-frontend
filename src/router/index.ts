import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import AuthLayout from '../layouts/AuthLayout.vue';
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
