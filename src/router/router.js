import TaskManager from '@/components/TaskManager.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/v1/task',
    name:"tasklist" ,
    component: TaskManager
    },
    { path: '/', 
    name:"homepage",
    component: () => import('../components/HomePage.vue') }
]
const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
