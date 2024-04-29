import { createRouter, createWebHistory } from "vue-router"
import TaskManagerVue from "@/TaskManager.vue"

const routes = [
  {
    path: "/task",
    name: "tasklist",
    component: TaskManagerVue,
  },
  {
    path: "/task/:taskId",
    name: "taskdetail",
    component: TaskManagerVue,
  },
  {
    path: "/",
    redirect: "/task",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
