import PopupModalVue from '@/components/PopupModal.vue'
import TaskManagerVue from '@/TaskManager.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/task',
    name:"tasklist" ,
    component: TaskManagerVue
    },
    { path: '/', 
    name:"homepage",
    component: () => import('../components/HomePage.vue') },
    // { path: '/form',
    // name:"taskdetails" ,
    // component: TaskManagerVue
    // }
]
const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
