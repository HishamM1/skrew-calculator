import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('../views/PlayersView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/history/:id',
      name: 'history-detail',
      component: () => import('../views/HistoryDetailView.vue')
    }
  ]
})


router.beforeResolve(async (to, from, next) => {
  const auth = useAuth()
  await auth.getUser()
  const loggedIn = auth.isLoggedIn
  const publicPages = ['/login', '/register']

  document.title = to.name  

  if(!loggedIn && !publicPages.includes(to.path)) {
    return next({ name: 'Login' })
  }
  if (loggedIn && publicPages.includes(to.path)) {
    return next({ name: 'Home' })
  }
  next()
})

export default router
