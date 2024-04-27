import TaskDetail from '@/components/TaskDetail.vue'
import TaskManager from '@/components/TaskManager.vue'
import { defineProps } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
// const props = defineProps({
//   tasks: {
//     type: Array,
//     // required: true
//   }
// })
// for (const task of props.tasks) {
//   console.log(task)
// }
const routes = [
    { path: '/task',
    name:"tasklist" ,
    component: TaskManager
    },
    { path: '/', 
    name:"homepage",
    component: () => import('../components/HomePage.vue') },
    { path: `/form`,
    name:"taskdetail",
    component: TaskDetail}
]
const router = createRouter({
    history: createWebHistory(),
    routes
  })

export default router
