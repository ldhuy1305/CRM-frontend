import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/modules/auth.ts'
import Home from '@/views/Home.vue'

import AccountCreate from '@/views/account/AccountCreate.vue'
import AccountDetails from '@/views/account/AccountDetails.vue'
import Account from '@/views/account/AccountIndex.vue'
import CampaignCreate from '@/views/campaign/CampaignCreate.vue'
import CampaignDetails from '@/views/campaign/CampaignDetails.vue'
import CampaignEdit from '@/views/campaign/CampaignEdit.vue'
import Campaign from '@/views/campaign/CampaignIndex.vue'
import ContactCreate from '@/views/contact/ContactCreate.vue'
import ContactDetails from '@/views/contact/ContactDetails.vue'
import ContactEdit from '@/views/contact/ContactEdit.vue'
import Contact from '@/views/contact/ContactIndex.vue'
import DealCreate from '@/views/deal/DealCreate.vue'
import DealDetails from '@/views/deal/DealDetails.vue'
import DealEdit from '@/views/deal/DealEdit.vue'
import Deals from '@/views/deal/DealIndex.vue'
import NotFound from '@/views/error/NotFound.vue'
import LeadConvert from '@/views/lead/LeadConvert.vue'
import LeadCreate from '@/views/lead/LeadCreate.vue'
import LeadDetails from '@/views/lead/LeadDetails.vue'
import LeadEdit from '@/views/lead/LeadEdit.vue'
import Lead from '@/views/lead/LeadIndex.vue'
import ProfilePage from '@/components/profile/ProfilePage.vue'
import TaskCreate from '@/views/task/TaskCreate.vue'
import TaskDetails from '@/views/task/TaskDetails.vue'
import TaskEdit from '@/views/task/TaskEdit.vue'
import Task from '@/views/task/TaskIndex.vue'

import AccountEdit from '@/views/account/AccountEdit.vue'
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

      { path: 'contacts', name: 'Contacts', component: Contact },
      {
        path: '/contacts/create',
        name: 'CreateContact',
        component: ContactCreate,
        meta: { requiresAuth: true },
      },
      {
        path: '/contacts/:id',
        name: 'ContactDetails',
        component: ContactDetails,
        meta: { requiresAuth: true },
      },
      {
        path: '/contacts/:id/edit',
        name: 'ContactEdit',
        component: ContactEdit,
        meta: { requiresAuth: true },
      },

      { path: 'accounts', name: 'Accounts', component: Account, meta: { requiresAuth: true } },
      {
        path: '/accounts/:id',
        name: 'AccountDetails',
        component: AccountDetails,
        meta: { requiresAuth: true },
      },
      {
        path: '/accounts/create',
        name: 'CreateAccount',
        component: AccountCreate,
        meta: { requiresAuth: true },
      },
      {
        path: '/accounts/:id/edit',
        name: 'EditAccount',
        component: AccountEdit,
        meta: { requiresAuth: true },
      },

      { path: 'deals', name: 'Deals', component: Deals },
      {
        path: '/deals/:id',
        name: 'DealDetails',
        component: DealDetails,
        meta: { requiresAuth: true },
      },
      {
        path: '/deals/create',
        name: 'CreateDeal',
        component: DealCreate,
        meta: { requiresAuth: true },
      },
      {
        path: '/deals/:id/edit',
        name: 'EditDeal',
        component: DealEdit,
        meta: { requiresAuth: true },
      },
      {
        path: '/profile',
        name: 'ProfilePage',
        component: ProfilePage,
        meta: { requiresAuth: true },
      },
      { path: 'campaigns', name: 'Campaigns', component: Campaign, meta: { requiresAuth: true } },
      {
        path: '/campaigns/:id',
        name: 'campaignsDetails',
        component: CampaignDetails,
        meta: { requiresAuth: true },
      },

      {
        path: '/campaigns/create',
        name: 'CreateCampaigns',
        component: CampaignCreate,
        meta: { requiresAuth: true },
      },

      {
        path: '/campaigns/:id/edit',
        name: 'EditCampaigns',
        component: CampaignEdit,
        meta: { requiresAuth: true },
      },

      { path: 'tasks', name: 'Tasks', component: Task, meta: { requiresAuth: true } },

      {
        path: '/tasks/:id',
        name: 'TasksDetails',
        component: TaskDetails,
        meta: { requiresAuth: true },
      },

      {
        path: '/tasks/create',
        name: 'CreateTask',
        component: TaskCreate,
        meta: { requiresAuth: true },
      },

      {
        path: '/tasks/:id/edit',
        name: 'EditTask',
        component: TaskEdit,
        meta: { requiresAuth: true },
      },
      // { path: 'meetings', name: 'Meetings', component: () => import('@/views/Meetings.vue') },
      // { path: 'calls', name: 'Calls', component: () => import('@/views/Calls.vue') },
      // { path: 'reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
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
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Wait for auth to be initialized
  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
