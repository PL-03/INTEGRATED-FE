import { createRouter, createWebHistory } from "vue-router"
import TaskManager from "@/TaskManager.vue"

const routes = [
  {
    path: "/task",
    name: "tasklist",
    component: TaskManager,
  },
  {
    path: "/task/:taskId",
    name: "taskdetail",
    component: TaskManager,
  },
  {
    path: "/",
    redirect: "/task",
  },
  {
    path: "/task/add",
    name: "taskadd",
    component: TaskManager,
  },
  {
    path: "/task/:taskId/edit",
    name: "taskedit",
    component: TaskManager,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
