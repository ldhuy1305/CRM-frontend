import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/modules/auth.ts'
import Home from '@/views/Home.vue'

import Lead from '@/views/lead/Lead.vue'
import LeadConvert from '@/views/lead/LeadConvert.vue'
import LeadCreate from '@/views/lead/LeadCreate.vue'
import LeadDetails from '@/views/lead/LeadDetails.vue'
import LeadEdit from '@/views/lead/LeadEdit.vue'

import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'leads', name: 'Leads', component: Lead },
      {
        path: '/leads/create',
        name: 'CreateLead',
        component: LeadCreate,
        meta: { requiresAuth: true },
      },
      {
        path: '/leads/:id',
        name: 'LeadDetails',
        component: LeadDetails,
        meta: { requiresAuth: true },
      },
      {
        path: '/leads/:id/convert',
        name: 'LeadConvert',
        component: LeadConvert,
        meta: { requiresAuth: true },
      },
      {
        path: '/leads/:id/edit',
        name: 'LeadEdit',
        component: LeadEdit,
        meta: { requiresAuth: true },
      },

      // { path: 'contacts', name: 'Contacts', component: () => import('@/views/Contacts.vue') },
      // { path: 'deals', name: 'Deals', component: () => import('@/views/Deals.vue') },
      // { path: 'meetings', name: 'Meetings', component: () => import('@/views/Meetings.vue') },
      // { path: 'calls', name: 'Calls', component: () => import('@/views/Calls.vue') },
      // { path: 'reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
      // { path: 'campaigns', name: 'Campaigns', component: () => import('@/views/Campaigns.vue') },
      // { path: 'documents', name: 'Documents', component: () => import('@/views/Documents.vue') },
      // { path: 'visits', name: 'Visits', component: () => import('@/views/Visits.vue') },
      // { path: 'projects', name: 'Projects', component: () => import('@/views/Projects.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: 'Đăng nhập UNIBEAM' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
